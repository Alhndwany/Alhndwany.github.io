// تهيئة الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة متغيرات عامة
    let currentTheme = 'dark';
    let simulationInterval;
    let movingTargetInterval;
    
    // ===== وظائف التنقل =====
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('themeToggle');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    // تبديل القائمة على الأجهزة المحمولة
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // إغلاق القائمة عند النقر على رابط
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // تبديل الوضع النهاري/الليلي
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
        
        const icon = themeToggle.querySelector('i');
        if (currentTheme === 'light') {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // تحميل النسق المحفوظ
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
    
    // زر العودة للأعلى
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // تفعيل الروابط النشطة أثناء التمرير
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // ===== تأثيرات الظهور =====
    const revealElements = document.querySelectorAll('.reveal');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // تنفيذ مرة أولى عند التحميل
    
    // ===== تفعيل علامات التبويب =====
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // إزالة النشاط من جميع الأزرار والمحتويات
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إضافة النشاط للعنصر المحدد
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // ===== محاكاة نظام التتبع =====
    const movingTarget = document.getElementById('movingTarget');
    
    if (movingTarget) {
        let targetPosition = 50;
        let direction = 1;
        
        function moveTarget() {
            // تغيير اتجاه الهدف بشكل عشوائي
            if (Math.random() < 0.05) {
                direction *= -1;
            }
            
            // تحديث موضع الهدف
            targetPosition += direction * (Math.random() * 4);
            
            // التأكد من بقاء الهدف في النطاق
            if (targetPosition < 20) {
                targetPosition = 20;
                direction = 1;
            } else if (targetPosition > 80) {
                targetPosition = 80;
                direction = -1;
            }
            
            // تطبيق الموضع الجديد
            movingTarget.style.top = `${targetPosition}%`;
            
            // محاكاة شعاع الليزر المتتبع
            const beamPath = document.querySelector('.beam-path');
            if (beamPath) {
                const angle = (targetPosition - 50) * 0.5;
                beamPath.style.transform = `translateY(-50%) rotate(${angle}deg)`;
            }
        }
        
        // تشغيل المحاكاة كل 100 مللي ثانية
        movingTargetInterval = setInterval(moveTarget, 100);
    }
    
    // ===== حاسبة الميزانية الضوئية =====
    const distanceSlider = document.getElementById('distance');
    const distanceValue = document.getElementById('distanceValue');
    const weatherSelect = document.getElementById('weather');
    const powerSlider = document.getElementById('power');
    const powerValue = document.getElementById('powerValue');
    const rxPower = document.getElementById('rxPower');
    const berRate = document.getElementById('berRate');
    const availability = document.getElementById('availability');
    const calculateBtn = document.querySelector('.btn-calculate');
    
    // تحديث قيم المدخلات
    if (distanceSlider) {
        distanceSlider.addEventListener('input', function() {
            distanceValue.textContent = `${this.value} كم`;
            calculateLinkBudget();
        });
    }
    
    if (powerSlider) {
        powerSlider.addEventListener('input', function() {
            powerValue.textContent = `${this.value} dBm`;
            calculateLinkBudget();
        });
    }
    
    if (weatherSelect) {
        weatherSelect.addEventListener('change', calculateLinkBudget);
    }
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateLinkBudget);
    }
    
    // دالة حساب ميزانية الرابط
    function calculateLinkBudget() {
        if (!distanceSlider || !weatherSelect || !powerSlider) return;
        
        const distance = parseFloat(distanceSlider.value);
        const attenuationCoefficient = parseFloat(weatherSelect.value);
        const transmittedPower = parseFloat(powerSlider.value);
        
        // الحسابات المبسطة (لأغراض العرض فقط)
        // معادلة مبسطة: P_rx = P_tx - 20*log10(distance) - attenuation*distance
        const freeSpaceLoss = 20 * Math.log10(distance * 1000);
        const atmosphericLoss = attenuationCoefficient * distance / 10;
        const receivedPower = transmittedPower - freeSpaceLoss - atmosphericLoss;
        
        // تحديث القيم المعروضة
        if (rxPower) rxPower.textContent = `${receivedPower.toFixed(1)} dBm`;
        
        // حساب معدل الخطأ (BER) بشكل مبسط
        const snr = receivedPower + 30; // تحويل لـ SNR مبسط
        const ber = Math.max(1e-15, Math.pow(10, -snr/10));
        if (berRate) {
            berRate.textContent = ber < 0.001 
                ? `${ber.toExponential(1)}` 
                : `${ber.toFixed(6)}`;
        }
        
        // حساب نسبة التوفر
        const avail = 100 - (attenuationCoefficient * distance / 2);
        if (availability) {
            availability.textContent = `${Math.max(99.5, Math.min(100, avail)).toFixed(2)}%`;
        }
    }
    
    // حساب أولي عند التحميل
    calculateLinkBudget();
    
    // ===== نافذة المحاكاة =====
    const simulationBtn = document.getElementById('simulationBtn');
    const simulationModal = document.getElementById('simulationModal');
    const closeSimulation = document.getElementById('closeSimulation');
    const simDistance = document.getElementById('simDistance');
    const simDistanceValue = document.getElementById('simDistanceValue');
    const simWeather = document.getElementById('simWeather');
    const simPower = document.getElementById('simPower');
    const simPowerValue = document.getElementById('simPowerValue');
    const signalStrength = document.getElementById('signalStrength');
    const dataRate = document.getElementById('dataRate');
    const errorRate = document.getElementById('errorRate');
    const btnSimulate = document.querySelector('.btn-simulate');
    const simulationCanvas = document.getElementById('simulationCanvas');
    
    // فتح نافذة المحاكاة
    if (simulationBtn) {
        simulationBtn.addEventListener('click', function() {
            simulationModal.classList.add('active');
            startSimulation();
        });
    }
    
    // إغلاق نافذة المحاكاة
    if (closeSimulation) {
        closeSimulation.addEventListener('click', function() {
            simulationModal.classList.remove('active');
            stopSimulation();
        });
    }
    
    // إغلاق النافذة بالنقر خارجها
    simulationModal.addEventListener('click', function(e) {
        if (e.target === simulationModal) {
            simulationModal.classList.remove('active');
            stopSimulation();
        }
    });
    
    // تحديث قيم محاكاة المدخلات
    if (simDistance) {
        simDistance.addEventListener('input', function() {
            simDistanceValue.textContent = `${this.value} كم`;
            updateSimulation();
        });
    }
    
    if (simPower) {
        simPower.addEventListener('input', function() {
            const powerLevels = ['منخفضة', 'منخفضة إلى متوسطة', 'متوسطة', 'متوسطة إلى عالية', 'عالية', 'عالية جداً'];
            simPowerValue.textContent = powerLevels[this.value - 1];
            updateSimulation();
        });
    }
    
    if (simWeather) {
        simWeather.addEventListener('change', updateSimulation);
    }
    
    if (btnSimulate) {
        btnSimulate.addEventListener('click', updateSimulation);
    }
    
    // بدء المحاكاة
    function startSimulation() {
        // إنشاء عناصر المحاكاة في الـ Canvas
        if (simulationCanvas) {
            simulationCanvas.innerHTML = '';
            
            // خلفية السماء
            const sky = document.createElement('div');
            sky.className = 'simulation-sky';
            simulationCanvas.appendChild(sky);
            
            // المبني الأول
            const building1 = document.createElement('div');
            building1.className = 'simulation-building left';
            simulationCanvas.appendChild(building1);
            
            // المبني الثاني
            const building2 = document.createElement('div');
            building2.className = 'simulation-building right';
            simulationCanvas.appendChild(building2);
            
            // شعاع الليزر
            const laserBeam = document.createElement('div');
            laserBeam.className = 'simulation-laser';
            laserBeam.id = 'simLaserBeam';
            simulationCanvas.appendChild(laserBeam);
            
            // تأثيرات الطقس
            const weatherEffects = document.createElement('div');
            weatherEffects.className = 'weather-effects';
            weatherEffects.id = 'weatherEffects';
            simulationCanvas.appendChild(weatherEffects);
            
            // إضافة أنماط CSS للمحاكاة
            const style = document.createElement('style');
            style.textContent = `
                .simulation-sky {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(to bottom, #0a0a2a 0%, #1a1a3a 100%);
                }
                
                .simulation-building {
                    position: absolute;
                    bottom: 0;
                    width: 80px;
                    background: linear-gradient(to top, #333333 0%, #555555 100%);
                    border: 2px solid #222222;
                }
                
                .simulation-building.left {
                    left: 50px;
                    height: 150px;
                }
                
                .simulation-building.right {
                    right: 50px;
                    height: 180px;
                }
                
                .simulation-building::after {
                    content: '';
                    position: absolute;
                    top: -20px;
                    left: 0;
                    right: 0;
                    height: 20px;
                    background-color: #444444;
                    border-radius: 10px 10px 0 0;
                }
                
                .simulation-laser {
                    position: absolute;
                    left: 130px;
                    top: 30px;
                    width: calc(100% - 260px);
                    height: 2px;
                    background: linear-gradient(90deg, 
                        transparent 0%, 
                        #ff0000 20%, 
                        #00ffff 50%, 
                        #ff0000 80%, 
                        transparent 100%);
                    box-shadow: 0 0 10px #ff0000, 0 0 20px #00ffff;
                    transform-origin: left center;
                    z-index: 10;
                }
                
                .weather-effects {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    z-index: 5;
                }
                
                .weather-particle {
                    position: absolute;
                    background-color: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                }
                
                .rain-drop {
                    width: 2px;
                    height: 10px;
                    background: linear-gradient(to bottom, transparent 0%, #00aaff 100%);
                    border-radius: 0;
                    animation: rain-fall 1s linear infinite;
                }
                
                @keyframes rain-fall {
                    0% { top: -10px; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                
                .fog-particle {
                    background-color: rgba(200, 200, 200, 0.3);
                    animation: fog-float 10s infinite linear;
                }
                
                @keyframes fog-float {
                    0% { transform: translateY(0) translateX(0); opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.5; }
                    100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        updateSimulation();
    }
    
    // تحديث المحاكاة
    function updateSimulation() {
        const distance = parseFloat(simDistance.value);
        const weather = simWeather.value;
        const power = parseFloat(simPower.value);
        
        // تحديث شعاع الليزر
        const laserBeam = document.getElementById('simLaserBeam');
        if (laserBeam) {
            // تغيير سطوع الليزر بناءً على القوة
            const opacity = 0.3 + (power / 10) * 0.7;
            laserBeam.style.opacity = opacity;
            
            // تأثير الاهتزاز البسيط للمحاكاة الواقعية
            const jitter = Math.random() * 2 - 1;
            laserBeam.style.transform = `translateY(${jitter}px)`;
        }
        
        // تحديث تأثيرات الطقس
        updateWeatherEffects(weather);
        
        // تحديث الإحصائيات
        updateSimulationStats(distance, weather, power);
    }
    
    // تحديث تأثيرات الطقس
    function updateWeatherEffects(weather) {
        const weatherEffects = document.getElementById('weatherEffects');
        if (!weatherEffects) return;
        
        // مسح التأثيرات السابقة
        weatherEffects.innerHTML = '';
        
        // إضافة تأثيرات بناءً على نوع الطقس
        if (weather === 'rain') {
            for (let i = 0; i < 50; i++) {
                const drop = document.createElement('div');
                drop.className = 'weather-particle rain-drop';
                drop.style.left = `${Math.random() * 100}%`;
                drop.style.animationDelay = `${Math.random() * 2}s`;
                drop.style.animationDuration = `${0.5 + Math.random() * 1}s`;
                weatherEffects.appendChild(drop);
            }
        } else if (weather === 'fog') {
            for (let i = 0; i < 30; i++) {
                const fog = document.createElement('div');
                fog.className = 'weather-particle fog-particle';
                fog.style.width = `${20 + Math.random() * 30}px`;
                fog.style.height = fog.style.width;
                fog.style.left = `${Math.random() * 100}%`;
                fog.style.top = `${Math.random() * 100}%`;
                fog.style.animationDelay = `${Math.random() * 5}s`;
                weatherEffects.appendChild(fog);
            }
        } else if (weather === 'turbulence') {
            // تأثير الاضطراب الجوي
            const laserBeam = document.getElementById('simLaserBeam');
            if (laserBeam) {
                laserBeam.style.animation = 'beam-distortion 2s infinite ease-in-out';
            }
        }
    }
    
    // تحديث إحصائيات المحاكاة
    function updateSimulationStats(distance, weather, power) {
        // حسابات مبسطة للعرض
        const weatherFactors = {
            'clear': 1.0,
            'rain': 0.7,
            'fog': 0.3,
            'turbulence': 0.8
        };
        
        const weatherFactor = weatherFactors[weather] || 1.0;
        const signal = -25 - (distance * 3) + (power * 2) * weatherFactor;
        const rate = 10 * power * weatherFactor / 6;
        const error = Math.max(1e-12, Math.pow(10, -signal/10 - 2));
        
        // تحديث القيم المعروضة
        if (signalStrength) signalStrength.textContent = `${signal.toFixed(1)} dBm`;
        if (dataRate) dataRate.textContent = `${rate.toFixed(1)} Gbps`;
        if (errorRate) errorRate.textContent = `${error.toExponential(1)}`;
    }
    
    // إيقاف المحاكاة
    function stopSimulation() {
        if (simulationInterval) {
            clearInterval(simulationInterval);
        }
        
        // إيقاف اهتزاز الهدف في قسم المكونات
        if (movingTargetInterval) {
            clearInterval(movingTargetInterval);
        }
    }
    
    // ===== تفاعلية قسم فرق العمل =====
    function initTeamSection() {
        // تحريك أشرطة التكلفة عند التمرير
        const costBars = document.querySelectorAll('.cost-bar-fill');
        
        function animateCostBars() {
            costBars.forEach(bar => {
                const originalWidth = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = originalWidth;
                }, 300);
            });
        }
        
        // تفعيل التحريك عند ظهور القسم
        const teamSection = document.getElementById('team');
        if (teamSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(animateCostBars, 500);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(teamSection);
        }
        
        // تفعيل تفاعلية بطاقات الفرق
        const teamCards = document.querySelectorAll('.team-card');
        teamCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.team-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1.2)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.team-icon i');
                if (icon) {
                    icon.style.transform = 'scale(1)';
                }
            });
        });
        
        // تفاعلية مراحل التركيب
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach(step => {
            step.addEventListener('mouseenter', function() {
                const stepNumber = this.querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.transform = 'scale(1.2) rotate(360deg)';
                    stepNumber.style.transition = 'all 0.5s ease';
                }
            });
            
            step.addEventListener('mouseleave', function() {
                const stepNumber = this.querySelector('.step-number');
                if (stepNumber) {
                    stepNumber.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
    
    // تهيئة قسم الفرق عند تحميل الصفحة
    initTeamSection();
    
    // ===== تأثيرات إضافية =====
    
    // تأثيرات للبطاقات عند التمرير
    const componentCards = document.querySelectorAll('.component-card, .solution-card, .app-card, .team-card, .advantage-card');
    
    function animateCardsOnScroll() {
        componentCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const cardBottom = card.getBoundingClientRect().bottom;
            
            if (cardTop < window.innerHeight && cardBottom > 0) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }
    
    // تهيئة البطاقات مع تأثيرات
    componentCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateCardsOnScroll);
    animateCardsOnScroll(); // تنفيذ أولي
    
    // ===== معالج الأحداث العامة =====
    
    // منع السلوك الافتراضي لجميع أزرار التقديم
    const buttons = document.querySelectorAll('button[type="button"], .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('type') === 'submit') {
                e.preventDefault();
            }
        });
    });
    
    // تأثيرات عند تحميل الصفحة
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // إظهار العناصر بشكل تدريجي
        setTimeout(() => {
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }
        }, 500);
    });
    
    // ===== MathJax التهيئة =====
    if (typeof MathJax !== 'undefined') {
        MathJax.Hub.Config({
            tex2jax: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']],
                processEscapes: true,
                processEnvironments: true
            },
            'HTML-CSS': {
                linebreaks: { automatic: true },
                scale: 100
            },
            CommonHTML: {
                linebreaks: { automatic: true }
            },
            SVG: {
                linebreaks: { automatic: true }
            }
        });
        
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    }
    
    // ===== تهيئة أخيرة =====
    console.log('تم تحميل موقع Lazer Link بنجاح!');
    
    // تحديث عام للمحاكاة
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
    
    simulationInterval = setInterval(() => {
        if (simulationModal.classList.contains('active')) {
            updateSimulation();
        }
    }, 100);
});

// إضافة مستمع للأخطاء
window.addEventListener('error', function(e) {
    console.error('حدث خطأ:', e.error);
});
