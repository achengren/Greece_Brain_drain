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
