const stepCallbacks = {};

function onStepEnter(step, fn) {
    stepCallbacks[step] = fn;
}

function initScrollytelling() {
    // 页面导航点
    const sections = [
        document.getElementById('dashboard'),
        ...document.querySelectorAll('.step'),
        document.querySelector('footer')
    ].filter(Boolean);

    const dots = document.querySelectorAll('.pn-dot');
    let activeSection = 'dashboard';

    // 用 IntersectionObserver 追踪当前可见的 section → 更新导航点
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id || 'footer';
                if (id !== activeSection) {
                    activeSection = id;
                    dots.forEach(d => {
                        const isActive = d.getAttribute('href') === '#' + id;
                        d.classList.toggle('active', isActive);
                    });
                }
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(s => sectionObserver.observe(s));

    // 步骤回调（平滑滚动下门槛降低，保证触发）
    const steps = document.querySelectorAll('.step');
    let activeStep = null;

    const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = parseInt(entry.target.dataset.step);
                if (step !== activeStep) {
                    activeStep = step;

                    if (stepCallbacks[step]) {
                        stepCallbacks[step]();
                    }
                }
            }
        });
    }, { threshold: 0.15 });

    steps.forEach(s => stepObserver.observe(s));

    // 键盘导航（← → 方向键翻页）
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const snapSections = ['#dashboard', '#spread', '#impact', '#fields', '#author-role', '#next-gen', '#influence-analysis'];
            const currentIdx = snapSections.findIndex(s => s === '#' + activeSection);
            if (currentIdx === -1) return;
            const next = e.key === 'ArrowRight' ? currentIdx + 1 : currentIdx - 1;
            if (next >= 0 && next < snapSections.length) {
                document.querySelector(snapSections[next]).scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}
