import json
from pathlib import Path
from datetime import datetime

import numpy as np
import pandas as pd


# =========================
# Settings
# =========================

RAW_CANDIDATES = [
    Path("data/scientists_raw.csv"),
    Path("data/raw/scientists_raw.csv"),
    Path("data/raw/scientists.csv"),
    Path("data/scientists.csv")
]

OUT_DIR = Path("data/processed")
OUT_DIR.mkdir(parents=True, exist_ok=True)

MIN_COUNTRY_TOTAL = 50
MIN_CELL_N = 10

TOP_OVERSEAS_COUNTRIES = 9
TOP_FIELDS = 10


# =========================
# Helper functions
# =========================

def find_raw_path():
    for path in RAW_CANDIDATES:
        if path.exists():
            return path
    raise FileNotFoundError(
        "Cannot find raw data file. Tried: "
        + ", ".join(str(p) for p in RAW_CANDIDATES)
    )


def normalize_country_code(value):
    if pd.isna(value):
        return np.nan

    v = str(value).strip().lower()

    greece_variants = {
        "grc",
        "greece",
        "greek",
        "hellas",
        "ellada",
        "ελλάδα",
        "ελλαδα"
    }

    if v in greece_variants:
        return "grc"

    return v


# =========================
# Load raw data
# =========================

RAW_PATH = find_raw_path()
print("Running script:", Path(__file__).resolve())
print("Raw data path:", RAW_PATH)

df = pd.read_csv(RAW_PATH, low_memory=False)

required_cols = ["cntry", "sm-field"]
missing_cols = [col for col in required_cols if col not in df.columns]

if missing_cols:
    raise ValueError(f"Missing required columns in raw data: {missing_cols}")

df = df.dropna(subset=["cntry", "sm-field"]).copy()

df["cntry_original"] = df["cntry"]
df["cntry"] = df["cntry"].apply(normalize_country_code)
df["sm-field"] = df["sm-field"].astype(str).str.strip()

analysis_df = df.copy()

print(f"Total scientists with valid country and field: {len(analysis_df):,}")

country_counts_debug = analysis_df["cntry"].value_counts()

print("\nTop country codes after normalization:")
print(country_counts_debug.head(20))

if "grc" not in country_counts_debug.index:
    print("\nOriginal cntry values sample:")
    print(df["cntry_original"].value_counts().head(30))
    raise ValueError(
        "No Greece record detected after normalization. "
        "Check the raw cntry coding in your CSV."
    )

print(f"\nGreece / grc count after normalization: {country_counts_debug['grc']:,}")


# =========================
# Choose countries and fields
# =========================

country_totals_all = (
    analysis_df.groupby("cntry")
    .size()
    .reset_index(name="country_total")
    .sort_values("country_total", ascending=False)
)

overseas_country_totals = country_totals_all[
    country_totals_all["cntry"] != "grc"
].copy()

top_overseas_countries = (
    overseas_country_totals
    .head(TOP_OVERSEAS_COUNTRIES)["cntry"]
    .tolist()
)

top_countries = ["grc"] + top_overseas_countries

field_totals_all = (
    analysis_df.groupby("sm-field")
    .size()
    .reset_index(name="field_total")
    .sort_values("field_total", ascending=False)
)

top_fields = field_totals_all.head(TOP_FIELDS)["sm-field"].tolist()

overall_total = len(analysis_df)

print("\nMain countries for Section 6:")
print(top_countries)

print("\nMain fields for Section 6:")
print(top_fields)


# =========================
# Country × Field specialization
# =========================

country_field = (
    analysis_df.groupby(["cntry", "sm-field"])
    .size()
    .reset_index(name="n")
)

country_totals = (
    analysis_df.groupby("cntry")
    .size()
    .reset_index(name="country_total")
)

field_totals = (
    analysis_df.groupby("sm-field")
    .size()
    .reset_index(name="field_total")
)

spec = (
    country_field
    .merge(country_totals, on="cntry", how="left")
    .merge(field_totals, on="sm-field", how="left")
)

spec["overall_total"] = overall_total

# Formula 1:
# share_in_country = n(country, field) / total scientists in that country
spec["share_in_country"] = spec["n"] / spec["country_total"]

# Formula 2:
# share_overall = total scientists in that field / total scientists in all countries
spec["share_overall"] = spec["field_total"] / spec["overall_total"]

# Formula 3:
# Specialization Index:
# SI = share_in_country / share_overall
spec["specialization_index"] = spec["share_in_country"] / spec["share_overall"]

# Formula 4:
# Color value:
# log2(SI)
spec["log2_si"] = np.log2(spec["specialization_index"])

# Small-sample reliability flag
spec["reliable"] = spec["n"] >= MIN_CELL_N

# Clip color range for stable visualization
spec["log2_si_clipped"] = spec["log2_si"].clip(-1.5, 1.5)

# Main view flag
spec["in_main_view"] = (
    spec["cntry"].isin(top_countries)
    & spec["sm-field"].isin(top_fields)
)

spec = spec.sort_values(["cntry", "sm-field"]).reset_index(drop=True)

if not (spec["cntry"] == "grc").any():
    raise ValueError("After aggregation, specialization data still does not contain grc.")

print(f"\nRows in specialization data: {len(spec):,}")
print(f"Rows for Greece / grc in specialization data: {(spec['cntry'] == 'grc').sum():,}")

with open(OUT_DIR / "country_field_specialization.json", "w", encoding="utf-8") as f:
    json.dump(spec.to_dict(orient="records"), f, ensure_ascii=False, indent=2)

print(f"Saved: {OUT_DIR / 'country_field_specialization.json'}")


# =========================
# Field diversity by country
# =========================

eligible_countries = country_totals_all[
    country_totals_all["country_total"] >= MIN_COUNTRY_TOTAL
]["cntry"].tolist()

div_base = analysis_df[analysis_df["cntry"].isin(eligible_countries)].copy()

div_counts = (
    div_base.groupby(["cntry", "sm-field"])
    .size()
    .reset_index(name="n")
)

div_country_totals = (
    div_base.groupby("cntry")
    .size()
    .reset_index(name="total")
)

div_counts = div_counts.merge(div_country_totals, on="cntry", how="left")

# p_field = n(country, field) / total scientists in that country
div_counts["share"] = div_counts["n"] / div_counts["total"]

# Field Diversity Index:
# diversity = 1 - sum(p_field^2)
diversity = (
    div_counts.groupby("cntry")
    .apply(lambda g: 1 - np.sum(g["share"] ** 2))
    .reset_index(name="field_diversity")
)

diversity = diversity.merge(div_country_totals, on="cntry", how="left")

top_fields_by_country = {}

for country, g in div_counts.groupby("cntry"):
    top3 = (
        g.sort_values("n", ascending=False)
        .head(3)[["sm-field", "n", "share"]]
        .rename(columns={"sm-field": "field"})
        .to_dict(orient="records")
    )
    top_fields_by_country[country] = top3

diversity["top_fields"] = diversity["cntry"].map(top_fields_by_country)


def classify_country(row):
    if row["total"] >= 500 and row["field_diversity"] >= 0.80:
        return "large_generalist_hub"
    elif row["total"] >= 500:
        return "large_specialized_hub"
    elif row["field_diversity"] >= 0.80:
        return "small_generalist_node"
    else:
        return "small_specialized_node"


diversity["portfolio_type"] = diversity.apply(classify_country, axis=1)

diversity = diversity.sort_values("total", ascending=False).reset_index(drop=True)

with open(OUT_DIR / "country_field_diversity.json", "w", encoding="utf-8") as f:
    json.dump(diversity.to_dict(orient="records"), f, ensure_ascii=False, indent=2)

print(f"Saved: {OUT_DIR / 'country_field_diversity.json'}")
print(f"Rows in diversity data: {len(diversity):,}")


# =========================
# Metadata
# =========================

metadata = {
    "generated_at": datetime.now().isoformat(timespec="seconds"),
    "description": "Section 6 country-field portfolio analysis, including Greece as domestic reference",
    "analysis_scope": "All scientists with valid country and field information",
    "greece_included": True,
    "domestic_reference_country": "grc",
    "specialization_formula": "SI = (n_country_field / n_country_total) / (n_field_total / n_overall_total)",
    "color_formula": "color = log2(SI), clipped to [-1.5, 1.5]",
    "diversity_formula": "Field Diversity Index = 1 - sum(p_field^2)",
    "min_country_total": MIN_COUNTRY_TOTAL,
    "min_cell_n": MIN_CELL_N,
    "top_countries": top_countries,
    "top_fields": top_fields,
    "total_scientists_included": int(overall_total),
    "greece_count": int(country_counts_debug["grc"])
}

with open(OUT_DIR / "country_field_portfolio_metadata.json", "w", encoding="utf-8") as f:
    json.dump(metadata, f, ensure_ascii=False, indent=2)

print(f"Saved: {OUT_DIR / 'country_field_portfolio_metadata.json'}")

print("\nMetadata top_countries written:")
print(metadata["top_countries"])

print("\nDone.")
