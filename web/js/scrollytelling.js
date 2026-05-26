/**
 * 滚动叙事控制 (Scrollytelling)
 * 使用 Intersection Observer 检测每个 step 的可视状态
 * 进入新 step 时触发对应的图表渲染
 */
const stepCallbacks = {};

function onStepEnter(step, fn) {
    stepCallbacks[step] = fn;
}

function initScrollytelling() {
    const steps = document.querySelectorAll('.step');
    let activeStep = null;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const step = parseInt(entry.target.dataset.step);
                if (step !== activeStep) {
                    activeStep = step;
                    // 高亮当前步骤
                    steps.forEach(s => s.style.opacity = '0.5');
                    entry.target.style.opacity = '1';

                    if (stepCallbacks[step]) {
                        stepCallbacks[step]();
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    steps.forEach(s => observer.observe(s));
}
