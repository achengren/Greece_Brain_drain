import json
from pathlib import Path

import numpy as np
import pandas as pd


# =========================
# Settings
# =========================

RAW_PATH = Path("data/scientists_raw.csv")
OUT_DIR = Path("data/processed")
OUT_DIR.mkdir(parents=True, exist_ok=True)

MIN_COUNTRY_TOTAL = 50
MIN_CELL_N = 10

TOP_COUNTRIES = 12
TOP_FIELDS = 15


# =========================
# Load raw data
# =========================

df = pd.read_csv(RAW_PATH, low_memory=False)

# Keep rows with both country and field information
df = df.dropna(subset=["cntry", "sm-field"]).copy()

# Clean country and field strings
df["cntry"] = df["cntry"].astype(str).str.strip().str.lower()
df["sm-field"] = df["sm-field"].astype(str).str.strip()

# This section focuses on diaspora destinations, so exclude Greece
diaspora = df[df["cntry"] != "grc"].copy()

print(f"Total diaspora scientists with country and field: {len(diaspora):,}")


# =========================
# Choose countries and fields
# =========================

country_totals_all = (
    diaspora.groupby("cntry")
    .size()
    .reset_index(name="country_total")
    .sort_values("country_total", ascending=False)
)

eligible_countries = country_totals_all[
    country_totals_all["country_total"] >= MIN_COUNTRY_TOTAL
]["cntry"].tolist()

top_countries = country_totals_all.head(TOP_COUNTRIES)["cntry"].tolist()

field_totals_all = (
    diaspora.groupby("sm-field")
    .size()
    .reset_index(name="field_total")
    .sort_values("field_total", ascending=False)
)

top_fields = field_totals_all.head(TOP_FIELDS)["sm-field"].tolist()

overall_total = len(diaspora)


# =========================
# Country × Field specialization
# =========================

country_field = (
    diaspora.groupby(["cntry", "sm-field"])
    .size()
    .reset_index(name="n")
)

country_totals = (
    diaspora.groupby("cntry")
    .size()
    .reset_index(name="country_total")
)

field_totals = (
    diaspora.groupby("sm-field")
    .size()
    .reset_index(name="field_total")
)

spec = (
    country_field
    .merge(country_totals, on="cntry", how="left")
    .merge(field_totals, on="sm-field", how="left")
)

spec["overall_total"] = overall_total
spec["share_in_country"] = spec["n"] / spec["country_total"]
spec["share_overall"] = spec["field_total"] / spec["overall_total"]
spec["specialization_index"] = spec["share_in_country"] / spec["share_overall"]

# log2 specialization index
spec["log2_si"] = np.log2(spec["specialization_index"])

# Reliability flag: avoid over-interpreting tiny cells
spec["reliable"] = spec["n"] >= MIN_CELL_N

# Clip color range for visualization stability
spec["log2_si_clipped"] = spec["log2_si"].clip(-2, 2)

# Main view flag
spec["in_main_view"] = (
    spec["cntry"].isin(top_countries)
    & spec["sm-field"].isin(top_fields)
)

# Sort for readable output
spec = spec.sort_values(["cntry", "sm-field"]).reset_index(drop=True)

specialization_records = spec.to_dict(orient="records")

with open(OUT_DIR / "country_field_specialization.json", "w", encoding="utf-8") as f:
    json.dump(specialization_records, f, ensure_ascii=False, indent=2)

print(f"Saved: {OUT_DIR / 'country_field_specialization.json'}")
print(f"Rows: {len(specialization_records):,}")


# =========================
# Field diversity by country
# =========================

# Only compute diversity for countries with enough scientists
div_base = diaspora[diaspora["cntry"].isin(eligible_countries)].copy()

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
div_counts["share"] = div_counts["n"] / div_counts["total"]

# Simpson diversity: 1 - sum(p^2)
diversity = (
    div_counts.groupby("cntry")
    .apply(lambda g: 1 - np.sum(g["share"] ** 2), include_groups=False)
    .reset_index(name="field_diversity")
)

diversity = diversity.merge(div_country_totals, on="cntry", how="left")

# Top 3 fields for each country
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

# Rough label for interpretation
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

diversity_records = diversity.to_dict(orient="records")

with open(OUT_DIR / "country_field_diversity.json", "w", encoding="utf-8") as f:
    json.dump(diversity_records, f, ensure_ascii=False, indent=2)

print(f"Saved: {OUT_DIR / 'country_field_diversity.json'}")
print(f"Rows: {len(diversity_records):,}")


# =========================
# Metadata
# =========================

metadata = {
    "description": "Section 6 country-field portfolio analysis",
    "diaspora_definition": "cntry != 'grc'",
    "min_country_total": MIN_COUNTRY_TOTAL,
    "min_cell_n": MIN_CELL_N,
    "top_countries": top_countries,
    "top_fields": top_fields,
    "overall_diaspora_total": int(overall_total),
}

with open(OUT_DIR / "country_field_portfolio_metadata.json", "w", encoding="utf-8") as f:
    json.dump(metadata, f, ensure_ascii=False, indent=2)

print(f"Saved: {OUT_DIR / 'country_field_portfolio_metadata.json'}")
print("Done.")