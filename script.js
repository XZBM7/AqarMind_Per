/* ==========================================================================
   AqarMind - Slide Presentation Engine Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // State Variables
    let currentSlide = -1;
    let isTransitioning = false;
    let transitionTimer = null;
    let currentSlideDirection = 'next';
    let currentSlideVariant = 'glide';
    const slideVariants = ['glide', 'lift', 'zoom', 'tilt', 'arc', 'float'];
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const menuItems = document.querySelectorAll('.menu-item');
    const slideIndicator = document.getElementById('slideIndicator');
    const progressBar = document.getElementById('progressBar');
    const menuList = document.querySelector('.slide-menu ul');
   const slideOrder = [
    0, 1, 2, 39, 3, 4, 5, 6, 7, 8, 28,
    9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25, 26, 27, 29,
    30, 31, 33, 34, 35, 36, 32, 37,38
];
    const displayToOriginal = slideOrder;
    const originalToDisplay = new Map(slideOrder.map((originalIndex, displayIndex) => [originalIndex, displayIndex]));
    const orderedSlides = slideOrder.map(index => slides[index]);
    const orderedMenuItems = slideOrder.map(index => menuItems[index]);
    document.addEventListener("DOMContentLoaded", () => {

    const videos = document.querySelectorAll(".lazy-video");

    videos.forEach(video => {

        video.preload = "none";

    });

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            const video = entry.target;

            if (entry.isIntersecting) {

                if (!video.dataset.loaded) {

                    video.preload = "metadata";
                    video.load();

                    video.dataset.loaded = "true";

                }

            } else {

                video.pause();

            }

        });

    }, {
        rootMargin: "300px",
        threshold: 0.05
    });

    videos.forEach(video => observer.observe(video));

    document.addEventListener("play", function (e) {

        videos.forEach(video => {

            if (video !== e.target) {

                video.pause();

            }

        });

    }, true);

});
    // UI Elements
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const menuToggleBtn = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const toggleNotesBtn = document.getElementById('toggleNotesBtn');
    const notesDrawer = document.getElementById('notesDrawer');
    const closeNotesBtn = document.getElementById('closeNotes');
    const notesContent = document.getElementById('notesContent');
    const toggleThemeBtn = document.getElementById('toggleTheme');
    const toggleLanguageBtn = document.getElementById('toggleLanguage');
    const toggleFullscreenBtn = document.getElementById('toggleFullscreen');
    const appContainer = document.querySelector('.app-container');
    const presentationInfoTitle = document.querySelector('.presentation-info h1');
    const presentationInfoBadge = document.querySelector('.presentation-info .badge');
    const sidebarFooterText = document.querySelector('.sidebar-footer p');
    const notesDrawerTitle = notesDrawer.querySelector('h3');
    const titleSubtitle = document.querySelector('.main-subtitle');
    const publicationHeading = document.querySelector('.publication-card h3');
    const publicationBadge = document.querySelector('.pub-badge');
    const titleSlideSubtitle = document.querySelector('#slide-0 .main-subtitle');
    const titleSlidePubDoi = document.querySelector('#slide-0 .doi');
    const titleSlidePubDoiLink = document.querySelector('#slide-0 .doi a');
    const titleSlideTeamLabels = document.querySelectorAll('#slide-0 .team-info strong');
    const titleSlideTeamValues = document.querySelectorAll('#slide-0 .team-info span');
    const projectTeamNames = document.querySelectorAll('#slide-1 .card.glass h3');
    const overviewCards = document.querySelectorAll('#slide-2 .card.glass');
    const roleCards = document.querySelectorAll('#slide-3 .card.glass');
    const challengeCards = document.querySelectorAll('#slide-4 .card.glass');
    const solutionCards = document.querySelectorAll('#slide-5 .card.glass');
    const slideTitleNodes = document.querySelectorAll('.slide-title');
    const slideDescriptionNodes = document.querySelectorAll('.slide-description');
    const originalMenuLabels = Array.from(menuItems).map(item => item.querySelector('.slide-name')?.textContent.trim() || '');
    const originalSlideTitles = Array.from(slideTitleNodes).map(node => node.textContent.replace(/\s+/g, ' ').trim());
    const originalSlideDescriptions = Array.from(slideDescriptionNodes).map(node => node.textContent.replace(/\s+/g, ' ').trim());
    const slideTitleIcons = Array.from(slideTitleNodes).map(node => node.querySelector('i')?.outerHTML || '');
    let currentLanguage = 'en';
    const storageKeys = {
        theme: 'aqarmind_theme',
        language: 'aqarmind_language',
        slide: 'aqarmind_slide'
    };

    const languageStrings = {
        en: {
            headerTitle: 'Graduation Project Defense',
            badge: 'AqarMind',
            sidebarFooter: '© 2026 AqarMind Project',
            notesTitle: 'Speaker Notes',
            titleSubtitle: 'An intelligent and secure real estate platform built on event-driven architecture and multi-task AI',
            publicationBadge: 'Published Research',
            publicationHeading: 'An Empirical Evaluation of an Event-Driven Modular Monolithic Architecture Using Apache Kafka for Real-Time AI-Powered Systems',
            titleSlideSubtitle: 'An intelligent and secure real estate platform built on event-driven architecture and multi-task AI',
            titleSlidePubBadge: 'Published Research',
            titleSlidePubDoi: 'DOI: 10.36227/techrxiv.177069590.04655255/v1 | IEEE TechRxiv',
            titleSlideTeamLabels: ['Student Prepared By:', 'Supervised By:'],
            titleSlideTeamValues: ['Ibrahim Amr', 'Prof. Mai El-Defrawi'],
            projectTeamNames: [
                'Ibrahim Amr Ibrahim',
                'Ahmed Ibrahim Fouad',
                'Khaled Mohsen Hussein',
                'Rasha Salah Mahmoud',
                'Michael Emad Adly',
                'Mohamed Assem Saber'
            ],
            overviewCards: [
                {
                    title: 'Rebuilding Trust',
                    body: 'Eliminating real estate fraud through biometric owner verification and intelligent validation of official ownership documents.'
                },
                {
                    title: 'Decision Automation',
                    body: 'Leveraging 45 AI features to process images, documents, pricing, and financial risk autonomously, saving 80% of human review.'
                },
                {
                    title: 'Innovative Architecture',
                    body: 'Using the EDMMA hybrid architecture with Apache Kafka to connect the .NET core and Python AI services with outstanding efficiency.'
                }
            ],
            roleCards: [
                {
                    title: 'Searcher / Tenant',
                    bullets: [
                        'Intelligent semantic property search.',
                        'Using the chatbot as a personal advisor.',
                        'Submitting offers, reserving units, and paying online.'
                    ]
                },
                {
                    title: 'Landlord',
                    bullets: [
                        'Publishing listings and uploading documents.',
                        'Receiving offers and negotiating counter-offers.',
                        'Drafting and signing contracts electronically.'
                    ]
                },
                {
                    title: 'Company',
                    bullets: [
                        'Managing real estate units and residential projects.',
                        'Smart dashboard for sales tracking and customer bookings.',
                        'Assigning permissions to company-affiliated agents.'
                    ]
                },
                {
                    title: 'Admin',
                    bullets: [
                        'Smart automated review of documents and images.',
                        'Monitoring content and handling reports.',
                        'Managing permissions and blocking violating users.'
                    ]
                }
            ],
            challengeCards: [
                {
                    title: 'Targeting Newcomers and Visitors',
                    body: 'Tourists, expatriates, and people moving to a new area often lack local pricing knowledge and document verification context, making them easy targets for scams.'
                },
                {
                    title: 'Search Complexity and Lost Effort',
                    body: 'Traditional property search is time-consuming and noisy, forcing users to filter thousands of misleading listings without a reliable direct channel to the real owners.'
                },
                {
                    title: 'Fake Property Images and Manipulation',
                    body: 'Digitally edited or stolen images are widely used to deceive buyers, hide structural defects, and mask serious building issues.'
                },
                {
                    title: 'Installment and Rent Default Risk',
                    body: 'Owners and companies often lack smart tools to assess applicants\' income fit and financial ability to pay rent or installments, exposing them to default risk and legal disputes.'
                }
            ],
            challengeFooter: '<i class="fa-solid fa-rocket" style="color:var(--gold-color);"></i> The platform is designed with the scalable EDMMA architecture to absorb these phases without rewriting the core.',
            solutionCards: [
                {
                    title: 'Tenants and Newcomers',
                    bullets: [
                        'Full protection from scams through face-based identity verification and document validation.',
                        'A semantic search experience powered by an AI agent that understands real user intent.'
                    ]
                },
                {
                    title: 'Owners and Developers',
                    bullets: [
                        'Geospatial analytics for supply, demand, and area-level market trends.',
                        'A smart pricing engine that suggests fair prices and helps reduce installment risk.'
                    ]
                },
                {
                    title: 'Admin and Operations',
                    bullets: [
                        '80% of document and image verification handled automatically for faster final decisions.',
                        'Automated report triage, complaint classification, and platform safety checks.'
                    ]
                }
            ],
            toggleSidebarTitle: 'Collapse menu',
            menuToggleTitle: 'Open menu',
            themeTitle: 'Toggle theme',
            fullscreenTitle: 'Fullscreen',
            notesToggleTitle: 'Toggle speaker notes',
            closeNotesTitle: 'Close notes',
            languageTitle: 'Switch to Arabic',
            languageLabel: 'EN',
            menuLabels: [
                'Title Slide', 'Project Team', 'Project Overview', 'User Roles', 'Problem', 'Solution',
                'Architecture', 'Metrics', 'Tech Stack', 'AI Ecosystem', 'Document AI', 'Vision AI',
                'Fraud & Security', 'Pricing Analytics', 'Financial Risk', 'Smart Contracts',
                'Search & Recommendation', 'NLP & AI Agent', 'Content Moderation', 'Support Intelligence',
                'Chatbot Logic', 'Data Sync', 'Security Overview', '2FA', 'Face ID', 'Payments', 'RBAC',
                'Non-AI Features', 'Transaction Flow', 'Business Model', 'Challenges', 'Lessons Learned',
                'UI Screens', 'Strengths', 'Competitors', 'Roadmap', 'Datasets', 'Conclusion',
                'AI Ecosystem Libraries'
            ],
            slideTitles: [
                'AqarMind', 'Project Team', 'Project Overview & Vision', 'Four User Roles in the System',
                'Real Estate Scam Problem and New-Area Challenges', 'AqarMind: An Integrated Solution for Every Real Estate Stakeholder',
                'Innovative Architecture: EDMMA with Apache Kafka', 'Architecture Metrics and Evaluation',
                'Tech Stack, Development Tools, and Programming Languages', 'AI Ecosystem Map',
                '1. Document Intelligence', '2. Computer Vision and Media Integrity',
                '3. Security, Reliability, and Fraud Prevention', '4. Market Analytics and Pricing',
                '5. Financial Risk and Payment Assessment', '6. Smart Contracts and Deal Management',
                '7. Semantic Search and Recommendations', '8. NLP and AI Agent',
                '9. Content Safety and Moderation', '10. Support Intelligence and Complaint Routing',
                'How the AI Chatbot and Smart Search Work', 'Chatbot and Data Synchronization',
                'Integrated Security Framework Overview', 'A. Two-Factor Authentication and Secure Access',
                'B. Face-Based Identity Matching', 'C. Secure Payments and Card Verification',
                'D. Role-Based Access Control (RBAC)', 'Top 12 Non-AI Features',
                'Real Estate Transaction Lifecycle', 'Business Model and Revenue Streams',
                'Technical Challenges and How We Solved Them', 'Lessons Learned',
                'Key Platform Screens', 'Project Strengths for Academic Evaluation',
                'AqarMind vs. Competitors', 'Future Roadmap', 'Datasets and Training Data Sources',
                'Conclusion and Recommendations', 'Core Libraries & Dependencies'
            ],
            slideDescriptions: [
                'The students who contributed to building and developing the AqarMind graduation project.',
                'An integrated intelligent real estate platform designed to reshape the Egyptian and Arab property markets.',
                'AqarMind connects every stakeholder in the real estate workflow with dedicated roles and permissions.',
                'Security and trust challenges faced by property seekers, especially in unfamiliar areas and communities.',
                'Rebuilding trust and securing transactions with tailored, connected solutions for tenants, owners, and admins.',
                'A rigorous experimental evaluation showing clear gains in the performance and quality of intelligent real estate operations.',
                'The platform is built on a polyglot architecture to maximize performance and security.',
                'We developed and integrated 45 advanced AI functions across 10 functional groups to secure and simplify the entire real estate process.',
                'Automated pricing engines and time-based forecasts for prices and demand to help owners, investors, and companies.',
                'Advanced search and recommendation engines that understand user behavior and help them reach the best deal.',
                'Automated review tools that inspect text and filter abusive content to keep conversations safe for users.',
                'End-to-end protection for users, money, and personal data across multiple security layers.',
                'Behind the intelligent layer, AqarMind includes mature software engineering that delivers core operational capabilities.',
                'A full trace of every step in the real estate transaction lifecycle inside AqarMind, from posting the listing to signing the contract.',
                'AI models trained and evaluated using large, diverse datasets across all major functional areas.'
            ]
        },
        ar: {
            headerTitle: 'مناقشة مشروع التخرج',
            badge: 'AqarMind',
            sidebarFooter: '© 2026 مشروع AqarMind',
            notesTitle: 'نقاط التحدث والملاحظات الشفهية',
            titleSubtitle: 'منظومة عقارية ذكية وآمنة قائمة على هندسة الأحداث والذكاء الاصطناعي متعدد المهام',
            publicationBadge: 'بحث علمي منشور',
            publicationHeading: 'تقييم تجريبي لمعمارية أحادية نمطية معيارية قائمة على الأحداث باستخدام Apache Kafka للأنظمة اللحظية المدعومة بالذكاء الاصطناعي',
            titleSlideSubtitle: 'منظومة عقارية ذكية وآمنة قائمة على هندسة الأحداث والذكاء الاصطناعي متعدد المهام',
            titleSlidePubBadge: 'بحث علمي منشور',
            titleSlidePubDoi: 'DOI: 10.36227/techrxiv.177069590.04655255/v1 | منصة IEEE TechRxiv',
            titleSlideTeamLabels: ['إعداد الطالب:', 'تحت إشراف:'],
            titleSlideTeamValues: ['إبراهيم عمرو (Ibrahim Amr)', 'د. مي الدفراوي (Prof. Mai El-Defrawi)'],
            overviewCards: [
                {
                    title: 'بناء الثقة من جديد',
                    body: 'القضاء على الاحتيال العقاري عبر التحقق البيومتري من الملاك والفحص الذكي للوثائق الرسمية.'
                },
                {
                    title: 'أتمتة اتخاذ القرار',
                    body: 'الاعتماد على 45 وظيفة ذكاء اصطناعي لمعالجة الصور والوثائق والتسعير والمخاطر المالية تلقائياً وتقليل المراجعة البشرية بنسبة 80%.'
                },
                {
                    title: 'معمارية مبتكرة',
                    body: 'استخدام معمارية EDMMA الهجينة مع Apache Kafka لربط نواة .NET بخدمات الذكاء الاصطناعي المبنية بـ Python بكفاءة عالية.'
                }
            ],
            roleCards: [
                {
                    title: 'الباحث / المستأجر',
                    bullets: [
                        'بحث دلالي وذكي عن العقارات.',
                        'التعامل مع الشات بوت كمستشار عقاري شخصي.',
                        'إرسال العروض وحجز الوحدات والدفع إلكترونياً.'
                    ]
                },
                {
                    title: 'المالك',
                    bullets: [
                        'نشر الإعلانات ورفع مستندات الملكية.',
                        'استقبال العروض وإرسال المقترحات المضادة.',
                        'صياغة العقود والتوقيع عليها رقمياً.'
                    ]
                },
                {
                    title: 'الشركة / المطور',
                    bullets: [
                        'إدارة المشروعات السكنية والمجمعات العقارية الكبرى.',
                        'متابعة المبيعات واللوحات التحليلية وتوزيع الصلاحيات.',
                        'إسناد المهام لوكلاء الشركة والمندوبين.'
                    ]
                },
                {
                    title: 'المسؤول',
                    bullets: [
                        'مراجعة الوثائق والصور التي تم الإبلاغ عنها تلقائياً.',
                        'مراقبة المحتوى وإدارة البلاغات.',
                        'إدارة الصلاحيات وحظر الحسابات المخالفة.'
                    ]
                }
            ],
            challengeCards: [
                {
                    title: 'استغلال الوافدين والجدد في المنطقة',
                    body: 'السياح والمغتربون والنازحون إلى منطقة جديدة يفتقدون المعرفة المحلية بالأسعار والوثائق القانونية، مما يجعلهم أهدافاً سهلة للاحتيال.'
                },
                {
                    title: 'تجربة بحث غير فعالة ومجزأة',
                    body: 'عمليات البحث التقليدية تستهلك وقتاً طويلاً وتُظهر إعلانات مضللة أو مكررة، دون قناة موثوقة للوصول إلى المالك الحقيقي مباشرة.'
                },
                {
                    title: 'صور مضللة وتلاعب رقمي',
                    body: 'يُستخدم الفوتوشوب أو الصور المسروقة لتضليل المشترين وإخفاء العيوب الحقيقية في العقار مثل الشقوق والتلفيات.'
                },
                {
                    title: 'مخاطر التعثر في الأقساط والإيجار',
                    body: 'الملاك والمطورون يفتقدون أدوات ذكية لتقييم القدرة المالية والالتزام بالسداد، مما يرفع احتمالات التعثر والنزاعات القانونية.'
                }
            ],
            solutionCards: [
                {
                    title: 'الباحثون والوافدون الجدد',
                    bullets: [
                        'حماية كاملة من الاحتيال عبر التحقق بالوجه وفحص المستندات تلقائياً.',
                        'بحث دلالي مدعوم بوكيل ذكي يفهم نية المستخدم الحقيقية.'
                    ]
                },
                {
                    title: 'الملاك والمطورون',
                    bullets: [
                        'تحليلات جغرافية للعرض والطلب واتجاهات الأسعار في المناطق المختلفة.',
                        'محرك تسعير ذكي يقترح سعراً عادلاً ويقلل مخاطر التعثر.'
                    ]
                },
                {
                    title: 'المسؤولون والتشغيل',
                    bullets: [
                        'أتمتة 80% من مراجعة المستندات والصور لتسريع القرارات النهائية.',
                        'فرز البلاغات والتصنيفات والإشعارات بشكل آلي لضمان أمان المنصة.'
                    ]
                }
            ],
            projectTeamNames: [
                'إبراهيم عمرو إبراهيم', 'أحمد إبراهيم فؤاد', 'خالد محسن حسين',
                'رشا صلاح محمود', 'مايكل عماد عدلي', 'محمد عاصم صابر'
            ],
            toggleSidebarTitle: 'إغلاق القائمة',
            menuToggleTitle: 'فتح القائمة',
            themeTitle: 'تبديل المظهر',
            fullscreenTitle: 'شاشة كاملة',
            notesToggleTitle: 'إظهار/إخفاء الملاحظات الشفهية',
            closeNotesTitle: 'إغلاق الملاحظات',
            languageTitle: 'Switch to English',
            languageLabel: 'AR',
            menuLabels: [
                'الشريحة الافتتاحية',
                'أعضاء فريق المشروع',
                'نظرة عامة والرؤية',
                'أدوار مستخدمي النظام الأربعة',
                'أزمة الاحتيال العقاري والتحديات',
                'حل AqarMind المقترح',
                'التصميم المعماري الأساسي',
                'مؤشرات أداء المعمارية',
                'حزمة التقنيات والأدوات',
                'خريطة وظائف الذكاء الاصطناعي',
                'ذكاء المستندات',
                'الرؤية الحاسوبية',
                'الأمن ومكافحة الاحتيال',
                'تحليلات السوق والتسعير',
                'التقييم المالي ومخاطر الائتمان',
                'العقود الذكية والاستشارات',
                'البحث الدلالي والتوصيات',
                'الوكيل الذكي وNLP',
                'أمان المحتوى والاعتدال',
                'ذكاء الدعم وتوجيه التذاكر',
                'منطق الشات بوت',
                'مزامنة بيانات الشات بوت',
                'إطار الأمان المتكامل',
                'المصادقة الثنائية 2FA',
                'تحقق Face ID',
                'أمان بوابة الدفع',
                'التحكم في الوصول RBAC',
                'أهم 12 ميزة غير AI',
                'دورة المعاملة العقارية',
                'نموذج الأعمال والإيرادات',
                'التحديات والحلول',
                'الدروس المستفادة',
                'شاشات الواجهة',
                'نقاط التميز الأكاديمي',
                'مقارنة المنافسين',
                'خارطة الطريق',
                'مصادر البيانات',
                'الخاتمة والتوصيات',
                'مكتبات منظومة الذكاء الاصطناعي'
            ],
            slideTitles: [
                'AqarMind',
                'أعضاء فريق المشروع',
                'نظرة عامة ورؤية المنصة',
                'أربعة أدوار لمستخدمي النظام',
                'أزمة الاحتيال العقاري وتحديات الانتقال',
                'AqarMind: حل متكامل لكل أطراف المنظومة العقارية',
                'التصميم المعماري الأساسي: EDMMA مع Apache Kafka',
                'مؤشرات أداء المعمارية والتقييم',
                'حزمة التقنيات والأدوات ولغات البرمجة',
                'خريطة وظائف الذكاء الاصطناعي الـ 45',
                '1. ذكاء المستندات والتحقق الذكي',
                '2. الرؤية الحاسوبية وسلامة الوسائط',
                '3. الأمن والموثوقية ومكافحة الاحتيال',
                '4. تحليلات السوق والتسعير الذكي',
                '5. التقييم المالي ومخاطر الائتمان',
                '6. العقود الذكية ومشورة الصفقات',
                '7. البحث الدلالي والتوصيات الشخصية',
                '8. نواة NLP والوكيل العقاري الذكي',
                '9. أمان المحتوى والاعتدال',
                '10. ذكاء الدعم وتوجيه التذاكر',
                'منطق تنفيذ الشات بوت والبحث الذكي',
                'بنية الشات بوت وخط أنابيب مزامنة البيانات',
                'إطار الأمن متعدد المستويات المدمج',
                'A. المصادقة الثنائية والوصول الآمن (2FA)',
                'B. التحقق البيومتري من الهوية (Face ID)',
                'C. تكامل بوابة الدفع والتحقق من البطاقات',
                'D. التحكم الصارم في الوصول المبني على الأدوار (RBAC)',
                'أهم 12 ميزة برمجية أساسية غير قائمة على الذكاء الاصطناعي',
                'خط أنابيب دورة حياة المعاملة العقارية من البداية للنهاية',
                'استراتيجية الأعمال ومسارات تحقيق الدخل',
                'التحديات الهندسية وحلولها',
                'الدروس المستفادة من الرحلة الهندسية',
                'شاشات الواجهة الرئيسية',
                'التميز الأكاديمي ونقاط قوة المشروع',
                'التقييم التنافسي في السوق',
                'خارطة الطريق المستقبلية للمنصة',
                'مجموعات البيانات ومصادر التدريب',
                'الخاتمة والتوصيات لعام 2026',
                'المكتبات الأساسية والاعتمادات'
            ],
            slideDescriptions: [
                '',
                'الطلاب المشاركون في تصميم وهندسة وتطوير منصة AqarMind.',
                'منظومة عقارية ذكية ومتكاملة تهدف إلى إعادة تشكيل سوق العقارات المحلي والإقليمي.',
                'تربط منصة AqarMind جميع أطراف عملية العقار بصلاحيات وأدوار مخصصة.',
                'التحديات الأمنية ومشكلات الثقة التي يواجهها الباحثون عن العقار، خصوصًا في المناطق الجديدة وغير المألوفة.',
                'إعادة بناء الثقة وتأمين المعاملات العقارية بحلول مترابطة ومفصلة لكل من المستأجرين والملاك والمسؤولين.',
                'يعتمد النظام على معمارية هجينة متقدمة لتحقيق أفضل توازن بين الأداء والأمان وقابلية التوسع.',
                'توضح التقييمات التجريبية المكاسب الكبيرة في الأداء والكفاءة التي يحققها النموذج الهجين.',
                'يستخدم النظام لغات وأطر عمل متخصصة ومصممة لكل مجال من مجالاته الوظيفية.',
                'تضم المنصة 45 وظيفة ذكاء اصطناعي موزعة على 10 طبقات تشغيلية متكاملة.',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                '',
                'طبقة أمان قوية من اليوم الأول لحماية بيانات المستخدمين وبوابات الدفع.',
                '',
                '',
                '',
                '',
                'يستعرض هذا القسم 12 ميزة برمجية أساسية داخل المنصة لا تعتمد على الذكاء الاصطناعي.',
                'نظرة متسلسلة على رحلة المعاملة العقارية داخل بنية AqarMind من أول النشر حتى التوقيع.',
                '',
                'يوضح هذا القسم أهم التحديات الهندسية التي واجهتنا وكيف قمنا بحلها عمليًا.',
                '',
                'لقطة سريعة لأهم الشاشات التفاعلية التي تُظهر الجانب العملي للمنصة.',
                'تلخص هذه الشريحة أسباب القوة الأكاديمية والبرمجية للمشروع.',
                'مقارنة مباشرة بين AqarMind وأهم المنافسين في السوق المصري والعربي.',
                'عرض مرحلي لخارطة التطوير المستقبلية للمشروع عبر مراحل زمنية متتابعة.',
                'المصادر والبيانات التدريبية التي تم الاعتماد عليها في بناء النماذج الذكية.',
                ''
            ]
        }
    };

    // Speaker Notes Data (Arabic Original)
    const speakerNotesAr = {
        0: "مرحباً بأعضاء لجنة التحكيم الموقرين والحضور الكريم. يسعدنا اليوم تقديم مشروع تخرجنا AqarMind، وهو منصة عقارية ذكية وآمنة. الميزة الأبرز لمشروعنا أنه مبني على معمارية هندسية مبتكرة ومجربة تجريبياً، وقد تم نشر ورقة بحثية حول هذه المعمارية في منصة IEEE TechRxiv المرموقة، مما يعطي المشروع قيمة أكاديمية وتطبيقية مثبتة علمياً.",
        1: "نستعرض هنا أعضاء فريق العمل المشاركين في تصميم وبرمجة مشروع التخرج AqarMind. يضم الفريق الطلاب: إبراهيم عمرو إبراهيم، أحمد إبراهيم فؤاد، خالد محسن حسين، رشا صلاح محمود، مايكل عماد عدلي، ومحمد عاصم صابر. عمل الفريق معاً بانسجام تام تحت إشراف الدكتورة مي الدفراوي لتطوير كامل جوانب المنصة الهندسية والذكية.",
        2: "نقدم هنا نبذة عامة ورؤية مشروع AqarMind. المنصة ليست مجرد محرك بحث عادي، بل هي بيئة عمل ذكية متكاملة تهدف لإعادة بناء الثقة في سوق العقارات عن طريق التحقق البيومتري والفحص التلقائي للوثائق، مع أتمتة اتخاذ القرار بنسبة 80% وتخفيض الجهد البشري للمراجعة، بالاعتماد على بنية هندسية معمارية مبتكرة EDMMA منشورة أكاديمياً.",
        3: "نستعرض هنا أدوار مستخدمي منظومة AqarMind الأربعة بالتفصيل: أولاً الباحث أو المستأجر، حيث يستخدم البحث الذكي والشات بوت كوكيل عقاري شخصي. ثانياً المالك (Landlord)، حيث يقوم برفع الإعلانات وصياغة العقود وتوقيعها. ثالثاً الشركة العقارية، وتختص بطرح وإدارة الوحدات العقارية والمشاريع السكنية الكبيرة وتتبع المبيعات عبر لوحة تحكم ذكية وإسناد الصلاحيات لوكلائها. ورابعاً المدير (Admin) للمراجعة الذكية للوثائق وإدارة الشكاوى.",
        4: "نبدأ باستعراض المشكلة الكبرى في السوق العقاري وهي أزمة انعدام الثقة والنصب العقاري. المغتربون، السياح، والوافدون الجدد إلى أي بلد أو مدينة جديدة يجدون أنفسهم الفئة الأكثر عرضة للنصب لجهلهم التام بالأسعار المحلية والوثائق الرسمية وصحتها. أضف إلى ذلك عشوائية عملية البحث العقاري وتزييف صور العقارات لجذب انتباههم وتضليلهم عن عيوب البناء. ومن جهة أخرى، يفتقد الملاك أدوات موثوقة لتقييم الملاءة المالية للمستأجرين والمشترين بالأقساط قبل إبرام العقود لتفادي مخاطر تعثر السداد والنزاعات القانونية.",
        5: "الحل الذي يقدمه نظام AqarMind هو إعادة بناء الثقة وأتمتة اتخاذ القرار لكافة الأطراف. للمستأجر والوافد الجديد، نلغي النصب بالتحقق من الهوية بالوجه والوثائق، وتوفير شات بوت يبسط البحث. للملاك والمطورين، نقدم أدوات تحليل جغرافي للمناطق لتحديد استراتيجيات الاستثمار، مع محرك تسعير ذكي يقترح الأسعار العادلة بدقة. وبالنسبة للأدمن، فالذكاء الاصطناعي يتولى فحص ومطابقة 80% من الأوراق والصور تلقائياً، مما يدعمه لاتخاذ قرارات موافقة أو رفض فورية ودقيقة وتوفير الوقت والجهد الهائل.",
        6: "لتصميم نظام يحتوي على هذا الكم من نماذج الذكاء الاصطناعي، كان لا بد من بنية برمجية متفوقة. ابتكرنا وطبقنا معمارية EDMMA (Event-Driven Modular Monolith). حيث تحتفظ بالخدمات الأساسية في نواة C# .NET Core كتطبيق Modular Monolith سريع التماسك، بينما نرسل الأحداث الحسابية الكثيفة عبر Apache Kafka لمعالجتها بشكل غير متزامن في خوادم Python المخصصة للـ AI، متفادين تعقيدات الميكروسيرفسز وبطء المونوليث التقليدي.",
        7: "النتائج التجريبية التي تم نشرها في بحثنا العلمي أثبتت قوة التصميم: حيث انخفض زمن الاستجابة في النظام بنسبة 38%، وتحسنت سرعة التعافي من الأخطاء بمعدل 45% إلى 55%، مع خفض التعقيد التشغيلي وإدارة البنية التحتية بنسبة 60%، مع الحفاظ على معدل تدفق بيانات مماثل لنظم الميكروسيرفسز الكبيرة.",
        8: "نرى هنا شريحة التقنيات ولغات البرمجة بالتفصيل. نرى أمامنا طبقات النظام الهيكلية الستة: أولاً رياكت للواجهة الأمامية، ثانياً دوت نيت لإدارة النواة الأساسية، ثالثاً فلاسك كخادم للباك اند بايثون لمعالجة المحادثات الفورية، رابعاً فاست API لتوفير خدمات الذكاء الاصطناعي، خامساً كافكا لإدارة الأحداث والتواصل غير المتزامن بين الخدمات، وسادساً SQL Server و MongoDB لتخزين البيانات. وفي لغات البرمجة، تم الاعتماد على C#، بايثون، جافا سكريبت، SQL، و Bash/YAML مع إزالة HTML5/CSS3 لتأكيد اللغات البرمجية الفعالة.",
        9: "ننتقل الآن لجوهر الابتكار الذكي في مشروعنا: خريطة الـ 45 وظيفة ذكاء اصطناعي. قمنا بتطوير ودمج 45 خوارزمية ذكاء اصطناعي موزعة بدقة على 10 مجموعات متكاملة. تشمل المجموعة الأولى فحص مستندات الملكية والسجلات والتطابق لمنع النصب، والمجموعة الثانية والثالثة للرؤية الحاسوبية وكشف الفوتوشوب والـ Face ID والأمن المالي، والرابعة للتسعير والتنبؤ بالأسعار والطلب والاتجاهات، والخامسة والسادسة لتقييم مخاطر تعثر الأقساط وأهلية الإيجار وفحص ثغرات العقود، والمجموعة السابعة للبحث الدلالي ونظم التوصيات، والثامنة للشات بوت والوكيل الذكي، والتاسعة والعاشرة لسلامة المحتوى وأتمتة الدعم الفني وتصنيف الشكاوى. سنستعرض كل مجموعة من المجموعات العشر بالتفصيل في الشرائح القادمة.",
        10: "القسم الأول يركز على فحص الوثائق ويضم 5 وظائف: أولاً Ownership Document Analysis لفحص عقود الملكية وصكوكها. ثانياً Commercial Register Analysis لتأكيد صلاحية السجلات التجارية للشركات والمطورين. ثالثاً Post Document Analysis لمطابقة الوثائق المرفوعة بالإعلانات لمنع التناقض. رابعاً Project Document Analysis لتدقيق ملفات ومخططات المشاريع الكبرى للمطورين. وخامساً Document Analysis كنواة للتعرف الضوئي OCR وتصنيف المستندات، مما يختصر 80% من الجهد البشري.",
        11: "في القسم الثاني، نستخدم رؤية الكمبيوتر للتأكد من نزاهة الصور: الميزة الأولى تكشف التعديل الرقمي (Image Manipulation) لمعرفة هل الصور واقعية أم معدلة لإخفاء عيوب البناء. الميزة الثانية تقيم جودة الصورة جمالياً وترشحها للظهور أولاً في البحث، والميزة الثالثة تكشف الصور المكررة والمسروقة بالاعتماد على خوارزمية FAISS لحماية حقوق الملاك الفعليين.",
        12: "الأمان ومكافحة الاحتيال: نلزم المعلنين بـ Face ID بمطابقة صورهم الشخصية مع بطاقات الهوية الرسمية (National ID) لمنع انتحال الشخصية، بالإضافة لنموذج Fake Property المخصص لتوقع العقارات الوهمية قبل نشرها، ومراقبة الاحتيال المالي وسلوكيات المستخدمين لكشف الروبوتات والحظر التلقائي عند الحاجة.",
        13: "تحليلات السوق والتسعير الذكي وتضم 7 وظائف: أولاً Price Anomaly Detection لكشف شذوذ الأسعار وحماية الباحثين. ثانياً Price Suggestion لاقتراح السعر العادل للمالك. ثالثاً Price Forecasting للتنبؤ بالأسعار المستقبلية. رابعاً Market Trends Analysis لدراسة اتجاهات السوق العام. خامساً Demand Prediction لتوقع الطلب الفعلي على فئات العقارات. وسادساً وسابعاً Demand Forecasting و Revenue Forecasting للتنبؤ بالطلب المستقبلي والعوائد الاستثمارية للوحدات.",
        14: "التقييم المالي وتقييم مخاطر السداد: للتأكد من جدية العملاء وحماية المطورين، نطبق نموذج Installment Risk لتقييم احتمالية تعثر العميل في سداد الأقساط، ونموذج Rent Eligibility لمعرفة ملاءمة دخل المستأجر لقيمة الإيجار، مع محرك قرارات مالي مركزي (Decision Engine) يقبل أو يرفض المعاملة تلقائياً أو يقترح الشرائح الأنسب للمستخدم.",
        15: "العقود الذكية وإدارة الصفقات: يقوم النظام بقراءة بنود العقود المرفوعة ذاتياً واستخراج المخاطر والثغرات القانونية وتنبيه المستخدمين لها (Contract Risk Flagging)، ويقترح بنوداً إضافية لحماية الحقوق وفقاً للمواصفات، ونساعد الأطراف في مرحلة التفاوض باقتراح عروض أسعار وسطية عادلة (Counter Offer Suggestion) لإنجاح الصفقة.",
        16: "البحث الدلالي والتوصيات الذكية وتضم 6 وظائف: أولاً Query Understanding لفهم نية استعلام الباحث. ثانياً Semantic Ranking لترتيب النتائج معنوياً ودلالياً وليس حرفياً. ثالثاً Similar Listings Detection للربط بين العقارات المتشابهة لتسهيل المقارنة السعرية. رابعاً Personalized Feed لبناء صفحة تغذية مخصصة لكل باحث. خامساً Related Posts Recommendation لاقتراح عقارات شبيهة بالمعروض. وسادساً User-to-User Matching للمطابقة التلقائية بين البائع والمشتري دون وسيط.",
        17: "معالجة اللغة الطبيعية والـ AI Agent: قمنا ببرمجة عميل ذكي تفاعلي (AI Agent) يعمل كمستشار شخصي يستقبل تساؤلات المستخدمين ويبحث في قواعد البيانات ليوجههم للعقار الأنسب، بالإضافة لتوليد أوصاف تسويقية ذكية للعقارات (Text Proposals) وتوليد ردود مقترحة وسريعة للملاك على رسائل المستأجرين.",
        18: "سلامة ومراقبة المحتوى وتضم 5 وظائف: أولاً Content Moderation لفحص وتنقية نصوص وصور الإعلانات تلقائياً. ثانياً Spam Detection لتصفية الرسائل المكررة والمزعجة. ثالثاً Toxicity Scoring لقياس درجة السمية والتعديات اللفظية في المحادثات. رابعاً Sentiment Analysis لتحليل مشاعر وتقييمات المستخدمين. وخامساً Blocked Suggestions لاقتراح حظر المستخدمين المخالفين تلقائياً لحفظ سلامة المجتمع.",
        19: "الدعم الفني وتصنيف الشكاوى: نقوم بأتمتة تذاكر الدعم الفني وتصنيفها آلياً وتوجيهها للموظف المختص مع حساب أولوية الشكوى (Priority Scoring) وحل المشاكل بشكل فوري، وترتيب العروض المقدمة للملاك وتقديم ملخص كامل لسلوك العميل لمساعدة فريق الدعم الفني.",
        20: "ننتقل الآن لـ 'آلية عمل الشات بوت والبحث الذكي تلقائياً'. الشات بوت هنا ليس مجرد مجيب آلي، بل هو وكيل ذكي مستقل (Autonomous AI Agent) مبني بـ FastAPI و Python. يقوم بفهم استعلام المستخدم دلالياً (Semantic Parsing) وتفسير نية الباحث (Intent Extraction) عوضاً عن الكلمات المفتاحية الحرفية. الميزة الأكثر ابتكاراً هي قدرته على تشغيل عمليات بحث ومطابقة في الخلفية (Background Matching)، فإذا طلب مستخدم عقاراً بمواصفات معينة ولم يكن متوفراً، يقوم الشات بوت بمراقبة الإعلانات الجديدة فور نزولها ويقوم بحساب نقاط ملائمة (Match Score %) ويعرضها على المستخدم فوراً.",
        21: "نستعرض هنا 'تكامل الشات بوت وقواعد البيانات الفعلي'. يوضح هذا العرض التفاعلي كيف تم ربط الشات بوت بقاعدة بيانات MongoDB التي تتم مزامنتها تلقائياً مع خادم C# Core بمجرد إقرار موافقة الذكاء الاصطناعي على أي إعلان. قمنا بحل مشاكل مسارات صور العقارات لتعرض بدقة في واجهة الدردشة برابط كامل، وقمنا بربط زر تفاصيل العقار View برابط SPA داخلي تفاعلي يفتح في نافذة جديدة لضمان بقاء المستخدم في نفس المحادثة وعدم فقدان تاريخ الدردشة الجاري.",
        22: "نستعرض في هذا القسم 'الهيكل الأمني المتكامل للنظام'. الأمان ليس مجرد طبقة إضافية في AqarMind بل هو ركيزة أساسية متكاملة تهدف إلى القضاء تماماً على ثغرات الاحتيال العقاري. ينقسم الهيكل الأمني إلى 4 طبقات دفاعية صارمة سنقوم بتفصيلها: أولاً التحقق ثنائي العامل 2FA لتأمين الحسابات، ثانياً مطابقة الوجه الحيوي Face ID كجزء من إجراءات اعرف عميلك KYC، ثالثاً معالجة الدفع المشفرة والآمنة، ورابعاً نظام الصلاحيات الصارم RBAC لتقييد الوصول للمعلومات الحساسة.",
        23: "الطبقة الأمنية الأولى هي 'نظام التحقق ثنائي العامل والوصول الآمن 2FA'. لحماية حسابات المستخدمين من الاختراق والوصول غير المصرح به، نستخدم كود OTP مؤقت يتم إرساله لهاتف المستخدم وصالح لـ 5 دقائق فقط. كما نقوم بحماية كافة استدعاءات الـ APIs الخلفية بالاعتماد على رموز JWT قصيرة الصلاحية ومخزنة في HTTP-only cookies لمنع هجمات XSS. بالإضافة إلى تفعيل جدران حماية برمجية تراقب معدل الطلبات وتكشف هجمات Brute-force وتخمين كلمات المرور وتقوم بحظر الحسابات المشبوهة تلقائياً.",
        24: "الطبقة الأمنية الثانية هي 'مطابقة الهوية الحيوية بالوجه Face ID و KYC'. للتخلص نهائياً من الحسابات الوهمية والنصابين، نلزم المعلنين (ملاك وشركات) برفع صورة بطاقة الهوية الرسمية والتقاط سيلفي حي. تستخدم خدمة بايثون مكتبة DeepFace ونموذج VGG-Face استخراج متجهات الملامح للوجه ومقارنتهما بحساب الجيب تمام (Cosine Similarity)، فإذا تخطت نسبة التشابه حد الأمان، يوثق الحساب ويمنح علامة الأمان الخضراء لتعزيز ثقة السياح والمغتربين.",
        25: "الطبقة الأمنية الثالثة هي 'بوابة الدفع الإلكتروني والتحقق من الفيزا'. لحفظ المعاملات وحجز العقارات، قمنا بالربط مع بوابات دفع عالمية ومحلية موثوقة (Paymob & Stripe) متوافقة تماماً مع المعايير الأمنية العالمية PCI-DSS. يتم تشفير بيانات البطاقات بالكامل من الطرف للطرف. بالإضافة إلى ذلك، نقوم بتشغيل نموذج ذكاء اصطناعي مخصص لكشف الاحتيال المالي (Payment Fraud Detection) يحلل سلوك المعاملات وموقع العميل والـ IP وحالة البطاقة لحظر الكروت المسروقة فوراً.",
        26: "الطبقة الأمنية الرابعة هي 'نظام الصلاحيات الصارم المبني على الأدوار RBAC'. نستخدم سياسات تفويض صارمة في الـ Backend كـ Net Core. تمنع وصول أي طرف لبيانات غير مصرح له بها. فالأدمن يملك صلاحية إدارة البلاغات وتعليق الحسابات والتحليلات الإجمالية. بينما يملك المالك صلاحية إدارة عقاراته وعروضه وعقوده فقط. وتملك الشركة صلاحية إدارة المشاريع الضخمة وعقاراتها وفريقها. بينما يقتصر دور المستأجر على التصفح وتقديم العروض واستخدام الشات بوت.",
        27: "نستعرض هنا أهم 12 وظيفة برمجية متكاملة تم تطويرها في المشروع بدون استخدام الذكاء الاصطناعي، لنوضح متانة وقوة النظم الأساسية التي تدعم العمليات اليومية. نركز هنا على الخدمات الموجهة للشركات العقارية، مثل إدارة المشاريع والمجمعات السكنية الكبرى (Compounds)، والتحليل الجغرافي للعرض والطلب لتحديد أنشط المناطق، وإدارة طاقم المبيعات والوكلاء التابعين للشركة وصلاحياتهم لطرح الوحدات السكنية. بالإضافة للوظائف الأساسية مثل المحادثات الفورية، وإدارة وتوثيق العقود الإلكترونية، ونظام عروض الأسعار والمزايدات، وبوابات الدفع الإلكتروني عبر Stripe وPaymob، ولوحة مراجعة الطلبات والوثائق المعلقة من قبل الإدارة يدوياً لضمان النزاهة والموثوقية.",
        28: "نستعرض هنا دورة حياة المعاملة العقارية المتكاملة (End-to-End User Flow) عبر أربع خطوات متسلسلة: أولاً نزول البوست حيث يتم رفع العقار ومستنداته وفحصها آلياً؛ ثانياً تقديم الطلب بواسطة الباحث بعد استعانته بالشات بوت ودفع جدية الحجز؛ ثالثاً التفاوض والشراء عبر تفعيل عروض الأسعار والتحقق المالي؛ ورابعاً توقيع العقد الإلكتروني آلياً بعد التأكد من خلوه من الثغرات. يربط هذا التدفق بالكامل طبقات React و.NET وPython عبر معمارية EDMMA المبنية على Kafka.",
        29: "نقدم هنا نموذج الأعمال المعتمد لتحويل AqarMind لمشروع تجاري ناجح. لدينا 4 مصادر دخل رئيسية: اشتراكات B2B للشركات العقارية، عمولة على الصفقات المنجزة، الإعلانات الممولة Promoted Listings، وبيع تقارير التحليل عبر Data API للمستثمرين. هذا يضع المنصة في موضع يخدم ثلاث فئات: B2B و B2C والمطورين المؤسسيين.",
        30: "نستعرض هنا 7 تحديات تقنية رئيسية واجهتنا: تجميع داتا سيت العقارات المصرية من منصات ومصادر متعددة، ثم إدخال البيانات في الزمن الحقيقي، ثم تنظيف الأسعار والحقول الناقصة، ووسم بيانات الوثائق والوجه الحساسة، ثم معالجة الـ AI داخل المعمارية الجديدة بدون إبطاء النواة، ثم كشف التزوير في الصور والوثائق، وأخيراً الدردشة الفورية والدفعات تحت الضغط. الحل كان عبر pipeline streaming داخل EDMMA، وHuman-in-the-Loop labeling، ثم Kafka لتشغيل مهام الذكاء الاصطناعي غير المتزامنة مع FAISS وDeepFace وOCR وبوابات الدفع الآمنة.",
        31: "نستعرض أهم ما تعلمناه خلال مسيرة تطوير AqarMind. الدرس الأول: أن التصميم الهندسي المسبق يوفر الوقت لاحقاً. الدرس الثاني: أن عزل الخدمات المتخصصة يحسن الأداء جذرياً. الدرس الثالث: أن الأمان يجب أن يُبنى من الأساس وليس يُضاف لاحقاً. الدرس الرابع: أن تنوع تخصصات الفريق يُضاعف الإنتاجية عند التوزيع الصحيح للمهام.",
        32: "هذه الشريحة تعرض أبرز شاشات المنصة بشكل مرئي. أولاً شاشة البحث الدلالي الذي يفهم نية المستخدم. ثانياً الشات بوت الذي يعرض Match Score لكل عقار. ثالثاً لوحة التحكم للمالك والشركة لإدارة الإعلانات والعروض. رابعاً شاشة العقد الذكي التي تكشف البنود الخطرة قبل التوقيع. هذه الشاشات تجسّد الجانب العملي لكل وظائف الذكاء الاصطناعي التي شرحناها.",
        33: "هذه الشريحة تلخص 'نقاط التميز الأكاديمي والبرمجي لمشروع تخرجنا'. أولاً، البنية التحتية معتمدة ومجربة بورقة بحثية منشورة في IEEE TechRxiv. ثانياً، بيئة تشغيل برمجية مطابقة لمعايير الشركات الكبرى (Production-Grade) بالكامل داخل حاويات Docker وتوجيه Nginx. ثالثاً، الدمج الفعلي لأكثر من 40 ميزة ذكاء اصطناعي بشكل مستقر وسلس بفضل معمارية EDMMA المبنية على Kafka، مع تغطية الكود باختبارات Unit Tests لضمان ثبات الجودة.",
        34: "في هذه الشريحة نقارن AqarMind بأبرز المنافسين في السوق المصري والعربي: Aqarmap وOLX عقارات وNawy. تُظهر المقارنة بوضوح أن AqarMind هو الوحيد الذي يجمع بين التحقق البيومتري بالوجه Face ID وKYC، وكشف الصور المزيفة بالذكاء الاصطناعي، وشات بوت يبحث في الخلفية تلقائياً، وتحليل مستندات الملكية آلياً، وتقييم مخاطر الأقساط، فضلاً عن معمارية مبتكرة EDMMA منشورة في IEEE TechRxiv. هذا الجمع الشامل لا مثيل له في أي منصة عقارية محلية حالياً.",
        35: "تستعرض هذه الشريحة خارطة طريق تطوير AqarMind في 4 مراحل متتالية. الخط المركزي والأرقام تم إبرازها ليظهر التسلسل البصري بشكل أوضح أثناء العرض. المرحلة الأولى هي إطلاق تطبيق React Native لنظامَي iOS وAndroid. المرحلة الثانية التوسع الإقليمي في دول الخليج. المرحلة الثالثة دمج جولات الواقع الافتراضي VR للعقارات. والمرحلة الرابعة توثيق العقود على Blockchain. المنصة مصممة أصلاً بمعمارية EDMMA لاستيعاب هذه المراحل بسهولة دون إعادة هيكلة النواة.",
        36: "نستعرض هنا مصادر البيانات ومجموعات التدريب (Datasets & Data Sources) المستخدمة في تدريب الـ AI بـ AqarMind. نعتمد على Kaggle Real Estate لبيانات العقارات، ومجموعات LFW وCelebA للتحقق من تطابق الوجه بـ DeepFace، ومجموعة RVL-CDIP لتدريب فحص المستندات، ومجموعة CASIA Image Tampering لكشف التعديل والتزوير الرقمي بالصور، وAraSenti-Twitter لتحليل مشاعر النصوص، ومجموعة بيانات Credit Risk لتقييم احتمالات التعثر المالي.",
        37: "وصلنا إلى نهاية العرض في عام 2026. نشكر لجنة التحكيم الموقرة والدكتورة مي الدفراوي على إتاحة الفرصة لعرض هذا الجهد البحثي والتطويري. خلاصة AqarMind في أرقام لعام 2026: 45 وظيفة ذكاء اصطناعي مندمجة بإتقان، 4 أدوار مستخدمين بصلاحيات واضحة، وتحسّن 38% في زمن الاستجابة بفضل معمارية EDMMA المبتكرة المنشورة أكاديمياً. نوصي بالتكامل الكامل مع قواعد البيانات الحكومية وتدريب نماذج فهم اللغات الطبيعية على اللهجات المحلية وتطوير الأمان الحيوي. نرحب بجميع أسئلتكم وعقد المناقشة الكريمة.",
        38: "في هذه الشريحة نعرض المكتبات الفعلية المستخدمة داخل المنظومة، بعد إزالة التكرارات وتجميع الحزم المساندة. قسمناها إلى طبقة الويب والـ realtime، وطبقة الذكاء الاصطناعي والرؤية والتحقق البيومتري، وطبقة البيانات والرسائل والإعدادات، ثم حزم الدعم التشغيلي التي تحفظ استقرار التشغيل والإخراجات والأدوات التطويرية. الهدف هنا توضيح أن المنصة مبنية على مكتبات واضحة ومختارة بعناية، وليس على كود عشوائي أو اعتماد زائد على مكتبة واحدة."
    };

    // Speaker Notes Data (English Translation)
    const speakerNotesEn = {
        0: "Welcome to the esteemed judging committee and dear attendees. Today we are pleased to present our graduation project AqarMind, an intelligent and secure real estate platform. The most notable feature of our project is that it is built on an innovative and experimentally validated architectural design, and a research paper on this architecture has been published on the prestigious IEEE TechRxiv platform, giving the project proven academic and practical value.",
        1: "Here we present the team members involved in designing and programming the AqarMind graduation project. The team includes students: Ibrahim Amr Ibrahim, Ahmed Ibrahim Fouad, Khaled Mohsen Hussein, Rasha Salah Mahmoud, Michael Emad Adly, and Mohamed Assem Saber. The team worked together harmoniously under the supervision of Dr. Mai El-Defrawi to develop all engineering and intelligent aspects of the platform.",
        2: "Here we present an overview and vision of the AqarMind project. The platform is not just an ordinary search engine, but an integrated intelligent work environment aimed at rebuilding trust in the real estate market through biometric verification and automatic document screening, with 80% decision automation and reduction of human review effort, relying on the innovative EDMMA architectural design published academically.",
        3: "Here we detail the four user roles in the AqarMind system: First, the searcher or tenant, who uses intelligent search and chatbot as a personal real estate agent. Second, the Landlord, who publishes listings, drafts and signs contracts. Third, the real estate company, which manages real estate units and large residential projects, tracks sales through a smart dashboard, and assigns permissions to its agents. Fourth, the Admin for smart document review and complaint management.",
        4: "We begin by reviewing the major problem in the real estate market: the crisis of distrust and real estate fraud. Expatriates, tourists, and newcomers to any country or new city find themselves the most vulnerable to fraud due to their complete ignorance of local prices and official documents. Add to that the randomness of the property search process and the manipulation of property images to attract attention and hide construction defects. On the other hand, owners lack reliable tools to assess the financial solvency of tenants and installment buyers before concluding contracts to avoid default risks and legal disputes.",
        5: "The solution provided by the AqarMind system is to rebuild trust and automate decision-making for all parties. For the tenant and newcomer, we eliminate fraud through face identity verification and document validation, and provide a chatbot that simplifies search. For owners and developers, we provide geographic analysis tools for areas to determine investment strategies, with a smart pricing engine that suggests fair prices accurately. For admins, AI handles 80% of document and image verification automatically, supporting them to make immediate and accurate approval or rejection decisions and saving tremendous time and effort.",
        6: "To design a system containing this many AI models, a superior software architecture was necessary. We created and implemented the EDMMA (Event-Driven Modular Monolith) architecture. It keeps core services in a C# .NET Core modular monolith that is fast and cohesive, while sending intensive computational events through Apache Kafka for asynchronous processing in dedicated Python AI servers, avoiding the complexities of microservices and the slowness of traditional monolithic architecture.",
        7: "The experimental results published in our research paper proved the design's strength: response time decreased by 38%, error recovery speed improved by 45% to 55%, operational complexity and infrastructure management was reduced by 60%, while maintaining data throughput comparable to large microservices systems.",
        8: "Here we see the detailed technologies and programming languages stack. In front of us are six structural system layers: First, React for the front-end interface, second, .NET for core management, third, Flask as a Python backend server for real-time chat processing, fourth, FastAPI for providing AI services, fifth, Kafka for event management and asynchronous communication between services, and sixth, SQL Server and MongoDB for data storage. Regarding programming languages, we rely on C#, Python, JavaScript, SQL, and Bash/YAML.",
        9: "Now we move to the core of intelligent innovation in our project: the map of 45 AI functions. We developed and integrated 45 AI algorithms precisely distributed across 10 integrated groups. The first group includes ownership document and registry verification to prevent fraud, the second and third groups for computer vision, Photoshop detection, Face ID, and financial security, the fourth for pricing and price/demand/trend forecasting, the fifth and sixth for assessing installment default risk, rental eligibility, and contract gap detection, the seventh for semantic search and recommendation systems, the eighth for chatbot and AI agent, and the ninth and tenth for content safety, technical support automation, and complaint classification. We will review each of the ten groups in detail in the upcoming slides.",
        10: "The first section focuses on document inspection and includes 5 functions: First, Ownership Document Analysis to examine ownership contracts and deeds. Second, Commercial Register Analysis to confirm the validity of company and developer commercial registers. Third, Post Document Analysis to match uploaded documents with listings to prevent discrepancies. Fourth, Project Document Analysis to audit major project files and plans from developers. Fifth, Document Analysis as the core for OCR and document classification, saving 80% of human effort.",
        11: "In the second section, we use computer vision to ensure image integrity: The first feature detects digital manipulation to know if images are real or edited to hide construction defects. The second feature evaluates image quality aesthetically and prioritizes it for search appearance. The third feature detects duplicate and stolen images using the FAISS algorithm to protect actual owners' rights.",
        12: "Security and fraud prevention: We require advertisers to use Face ID matching their personal photos with official national ID cards to prevent identity impersonation, plus a dedicated Fake Property model to predict fake properties before publication, monitoring financial fraud and user behaviors to detect bots and automatically block when necessary.",
        13: "Market analytics and smart pricing include 7 functions: First, Price Anomaly Detection to detect price anomalies and protect searchers. Second, Price Suggestion to suggest fair prices to owners. Third, Price Forecasting to predict future prices. Fourth, Market Trends Analysis to study overall market trends. Fifth, Demand Prediction to predict actual demand for property categories. Sixth and seventh, Demand Forecasting and Revenue Forecasting to predict future demand and investment returns for units.",
        14: "Financial assessment and default risk evaluation: To ensure customer seriousness and protect developers, we apply Installment Risk to assess the probability of customer default on installments, Rent Eligibility to determine tenant income suitability for rental value, with a central financial Decision Engine that automatically accepts, rejects, or suggests the most suitable bands for the user.",
        15: "Smart contracts and deal management: The system reads uploaded contract clauses and extracts risks and legal gaps, alerting users to them (Contract Risk Flagging), suggests additional clauses to protect rights according to specifications, and helps parties in the negotiation phase by suggesting fair middle-ground counter offers (Counter Offer Suggestion) to close the deal successfully.",
        16: "Semantic search and smart recommendations include 6 functions: First, Query Understanding to understand searcher query intent. Second, Semantic Ranking to rank results semantically rather than literally. Third, Similar Listings Detection to link similar properties for easier price comparison. Fourth, Personalized Feed to build a customized feed page for each searcher. Fifth, Related Posts Recommendation to suggest properties similar to what is being viewed. Sixth, United-to-User Matching for automatic matching between buyer and seller without intermediaries.",
        17: "Natural language processing and AI Agent: We programmed an interactive intelligent agent (AI Agent) that acts as a personal consultant receiving user questions and searching databases to guide them to the most suitable property, in addition to generating smart marketing descriptions for properties (Text Proposals) and generating fast suggested replies for owners to tenant messages.",
        18: "Content safety and monitoring include 5 functions: First, Content Moderation to automatically screen and filter listing texts and images. Second, Spam Detection to filter duplicate and annoying messages. Third, Toxicity Scoring to measure toxicity levels and verbal abuse in conversations. Fourth, Sentiment Analysis to analyze user sentiment and reviews. Fifth, Blocked Suggestions to automatically suggest blocking violating users to maintain community safety.",
        19: "Technical support and complaint classification: We automate support tickets, automatically classify them, route them to the appropriate staff with priority scoring, resolve issues immediately, rank offers submitted to owners, and provide a complete summary of customer behavior to help the support team.",
        20: "Now we move to 'How the chatbot and smart search work automatically'. The chatbot here is not just an automated responder, but an independent autonomous AI agent built with FastAPI and Python. It semantically understands user queries and extracts searcher intent rather than literal keywords. The most innovative feature is its ability to run background matching searches. If a user requests a property with specific specifications that isn't available, the chatbot monitors new listings as soon as they are posted, calculates match scores, and presents them to the user immediately.",
        21: "Here we review 'The actual integration of the chatbot and databases'. This interactive demo shows how the chatbot was connected to the MongoDB database that is automatically synchronized with the C# Core server once AI approves any listing. We solved property image path issues so they display accurately in the chat interface with full links, and linked the View property details button to an internal interactive SPA link that opens in a new window to keep the user in the same conversation without losing chat history.",
        22: "In this section, we review 'The integrated security structure of the system'. Security is not just an additional layer in AqarMind but an integrated foundational pillar aimed at completely eliminating real estate fraud gaps. The security structure is divided into 4 strict defensive layers that we will detail: First, 2FA to secure accounts, second, biometric Face ID matching as part of KYC procedures, third, encrypted and secure payment processing, and fourth, strict RBAC permission system to restrict access to sensitive information.",
        23: "The first security layer is the 'Two-Factor Authentication and Secure Access System 2FA'. To protect user accounts from hacking and unauthorized access, we use a temporary OTP code sent to the user's phone valid for only 5 minutes. We also protect all backend API calls using short-lived JWT tokens stored in HTTP-only cookies to prevent XSS attacks. Additionally, we activate software firewalls that monitor request rates, detect brute-force and password-guessing attacks, and automatically block suspicious accounts.",
        24: "The second security layer is 'Biometric Face ID matching and KYC'. To completely eliminate fake accounts and scammers, we require advertisers (owners and companies) to upload their official national ID card image and take a live selfie. The Python service uses the DeepFace library and VGG-Face model to extract facial feature vectors and compare them using Cosine Similarity. If the similarity percentage exceeds the security threshold, the account is verified and given a green security badge to enhance trust for tourists and expatriates.",
        25: "The third security layer is the 'Electronic Payment Gateway and Visa Verification'. To secure transactions and property reservations, we have integrated with trusted global and local payment gateways (Paymob & Stripe) fully compliant with PCI-DSS security standards. Card data is fully encrypted end-to-end. Additionally, we run a dedicated AI model for Payment Fraud Detection that analyzes transaction behavior, customer location, IP, and card status to immediately block stolen cards.",
        26: "The fourth security layer is the 'Strict Role-Based Access Control System RBAC'. We use strict authorization policies in the .NET Core backend. It prevents any party from accessing data they are not authorized for. The Admin has full control to manage reports, suspend accounts, and view overall analytics. The Landlord can only manage their properties, offers, and contracts. The Company can manage large projects, their properties, and team. The Tenant is limited to browsing, submitting offers, and using the chatbot.",
        27: "Here we review the top 12 integrated software functions developed in the project without using AI, to demonstrate the robustness and strength of the core systems that support daily operations. We focus here on services for real estate companies, such as managing large residential compounds, geographic analysis of supply and demand to identify the most active areas, and managing sales teams and company agents with permissions to list residential units. Plus core functions like real-time chat, e-contract management and documentation, offer bidding systems, electronic payment gateways via Stripe and Paymob, and manual review dashboards for pending documents to ensure integrity and reliability.",
        28: "Here we review the integrated end-to-end real estate transaction lifecycle through four sequential steps: First, listing publication where the property and its documents are uploaded and automatically screened; second, application submission by the searcher after using the chatbot and paying the booking fee; third, negotiation and purchase through activating counter-offers and financial verification; fourth, automatically signing the electronic contract after ensuring it is free of gaps. This flow fully connects the React, .NET, and Python layers through the Kafka-based EDMMA architecture.",
        29: "Here we present the business model adopted to transform AqarMind into a successful commercial project. We have 4 main revenue sources: B2B subscriptions for real estate companies, commission on completed deals, promoted listings, and selling analytical reports via Data API to investors. This positions the platform to serve three categories: B2B, B2C, and institutional developers.",
        30: "Here we review 7 major technical challenges we faced: Building an Egyptian real estate dataset from multiple platforms and sources, then real-time data ingestion, then cleaning prices and missing fields, labeling sensitive document and face data, then processing AI within the new architecture without slowing the core, then detecting fraud in images and documents, and finally real-time chat and payments under pressure. The solution was through a streaming pipeline inside EDMMA, Human-in-the-Loop labeling, then Kafka for running asynchronous AI tasks with FAISS, DeepFace, OCR, and secure payment gateways.",
        31: "Here we review the most important lessons learned during the AqarMind development journey. Lesson one: Prior architectural design saves time later. Lesson two: Isolating specialized services dramatically improves performance. Lesson three: Security must be built from the ground up, not added later. Lesson four: Team diversity multiplies productivity when tasks are properly distributed.",
        32: "This slide visually presents the platform's key screens. First, the semantic search screen that understands user intent. Second, the chatbot showing Match Score for each property. Third, the owner/company dashboard for managing listings and offers. Fourth, the smart contract screen that detects risky clauses before signing. These screens embody the practical side of all the AI functions we have explained.",
        33: "This slide summarizes the 'Academic and software excellence points of our graduation project'. First, the infrastructure is validated and tested with a research paper published in IEEE TechRxiv. Second, a production-grade software environment fully inside Docker containers with Nginx routing. Third, the actual integration of over 40 AI features stably and smoothly thanks to the Kafka-based EDMMA architecture, with code coverage by unit tests to ensure quality stability.",
        34: "In this slide, we compare AqarMind with the most prominent competitors in the Egyptian and Arab market: Aqarmap, OLX Real Estate, and Nawy. The comparison clearly shows that AqarMind is the only platform that combines biometric Face ID verification and KYC, AI-based fake image detection, a chatbot that automatically searches in the background, automatic ownership document analysis, installment risk assessment, as well as an innovative EDMMA architecture published in IEEE TechRxiv. This comprehensive combination is unmatched in any local real estate platform currently.",
        35: "This slide presents the AqarMind development roadmap in 4 sequential phases. The central line and numbers have been highlighted to show the visual sequence more clearly during the presentation. Phase one is launching the React Native app for iOS and Android. Phase two is regional expansion into GCC countries. Phase three is integrating VR virtual reality tours for properties. Phase four is documenting contracts on Blockchain. The platform is originally designed with the EDMMA architecture to easily accommodate these phases without core restructuring.",
        36: "Here we review the data sources and training datasets used to train the AI in AqarMind. We rely on Kaggle Real Estate for property data, LFW and CelebA datasets for Face ID verification with DeepFace, RVL-CDIP dataset for document inspection training, CASIA Image Tampering Database for detecting digital image tampering and manipulation, AraSenti-Twitter for text sentiment analysis, and Credit Risk dataset for assessing financial default probabilities.",
37: "This slide presents the production deployment of AqarMind. The platform is deployed using a modern Docker-based containerized architecture running on Google Cloud infrastructure. All backend services, AI modules, databases, and supporting components operate together within a unified deployment environment based on the EDMMA architecture. The production server is configured with 150 GB SSD storage and 16 GB RAM to efficiently handle AI inference, document analysis, semantic search, and concurrent chatbot requests. The platform is publicly accessible through the domain https://aqarmind.duckdns.org, demonstrating a complete end-to-end deployment from development to a live production environment.",

38: "We have reached the end of our presentation. We sincerely thank the honorable judging committee and our supervisor, Dr. Mai El-Defrawi, for their continuous guidance and support throughout this project. AqarMind combines 45 integrated AI functions, four clearly defined user roles, an IEEE-published EDMMA architecture, and an intelligent security-first approach to redefine digital real estate platforms. We hope our work contributes to building safer, smarter, and more reliable property ecosystems. Thank you for your time, and we welcome your questions and discussion.",

39: "This slide presents the actual libraries and frameworks used throughout the AqarMind platform. The dependencies are organized into logical groups including frontend technologies, backend frameworks, AI and machine learning libraries, document processing, biometric verification, messaging infrastructure, databases, and deployment tools. This organized stack demonstrates that every intelligent capability within the platform is supported by carefully selected production-ready technologies, ensuring scalability, maintainability, and high system performance."    };

    function applyDynamicBodyCopy(lang) {
        const setText = (node, value) => {
            if (node && value !== undefined && value !== null) {
                node.textContent = value;
            }
        };
        
        const setHTML = (node, value) => {
            if (node && value !== undefined && value !== null) {
                node.innerHTML = value;
            }
        };

        // Static Copy mappings based on targeted language
        const contentData = {
            en: {
                slide30: {
                    title: '<i class="fa-solid fa-wrench"></i> Technical Challenges and How We Solved Them',
                    titles: [
                        'Challenge: Building an Egyptian real estate dataset from multiple sources and platforms',
                        'Challenge: Real-time ingestion of data from live, constantly changing sources',
                        'Challenge: Noisy data, conflicting prices, and missing fields',
                        'Challenge: Labeling sensitive document and face data at scale',
                        'Challenge: Processing AI inside the new architecture without slowing the core',
                        'Challenge: Detecting fraud in images and documents',
                        'Challenge: Real-time chat and payments under pressure'
                    ],
                    bodies: [
                        'Solution: We collected data from Egyptian real-estate platforms, scraping pipelines, and internal sources, then normalized formats, prices, and local terminology inside EDMMA before any training or execution.',
                        'Solution: We built a streaming pipeline inside EDMMA that captures data in real time, then passes it through Kafka to synchronize it with storage and execution layers.',
                        'Solution: We applied price and unit normalization, outlier cleaning, and imputation policies for missing fields so the data could be compared and predicted reliably.',
                        'Solution: We used Human-in-the-Loop labeling with manual review for sensitive samples and masked personal data before training.',
                        'Solution: We split AI tasks into asynchronous services inside EDMMA and pushed heavy jobs through Kafka so they could run in parallel without affecting live performance.',
                        'Solution: FAISS for visual similarity, OCR for text inspection, and DeepFace for face matching in parallel layers.',
                        'Solution: We isolated the Flask + Socket.IO chat server from the core and secured payment gateways with PCI-DSS standards and a fraud-detection model.'
                    ]
                },
                slide31: {
                    title: '<i class="fa-solid fa-lightbulb"></i> Lessons Learned',
                    titles: [
                        'Start with the architecture before the code',
                        'Specialized service isolation makes a huge difference',
                        'Security is a foundation, not an afterthought',
                        'A multidisciplinary team is a strategic advantage'
                    ],
                    bodies: [
                        'Choosing EDMMA from day one saved us from rewriting the code repeatedly and gave us the flexibility to add AI services easily.',
                        'Splitting Flask as a dedicated chat server from .NET Core saved us from performance bottlenecks and enabled independent scaling.',
                        'Building 2FA, Face ID, and RBAC from day one was the right decision; adding them later would have been expensive and complex.',
                        'Parallel work across Backend, Frontend, AI, and DevOps specialists significantly increased productivity and reduced delivery time.'
                    ]
                },
                slide32: {
                    title: '<i class="fa-solid fa-desktop"></i> Key Platform Screens',
                    titles: [
                        '<i class="fa-solid fa-magnifying-glass"></i> Semantic Search Screen',
                        '<i class="fa-solid fa-robot"></i> AI Chatbot Screen',
                        '<i class="fa-solid fa-gauge-high"></i> Owner / Company Dashboard',
                        '<i class="fa-solid fa-file-signature"></i> Smart Contract Screen'
                    ],
                    bodies: [
                        'Understand search intent and rank results semantically, not literally.',
                        'The real-estate advisor with Match Score and continuous background search.',
                        'Manage listings, offers, contracts, and verification status.',
                        'Analyze contract clauses and detect risk before electronic signing.'
                    ]
                },
                slide33: {
                    title: '<i class="fa-solid fa-graduation-cap"></i> Project Strengths for Academic Evaluation',
                    titles: [
                        '<i class="fa-solid fa-book-open"></i> Published Scientific Research (TechRxiv)',
                        '<i class="fa-solid fa-code-branch"></i> Code Quality and Production-Grade Structure',
                        '<i class="fa-solid fa-brain"></i> Comprehensive AI Coverage',
                        '<i class="fa-solid fa-vial"></i> Automated Code Testing'
                    ],
                    bodies: [
                        'The project is based on an academically validated architecture published on IEEE TechRxiv, proving innovation and academic seriousness for EDMMA.',
                        'A production-ready software stack using Apache Kafka, Docker, FAISS, SQL Server, and MongoDB together in a single integrated system.',
                        'Not just one model or one feature, but document processing, computer vision, time-series forecasting, NLP, and recommendation engines in one cohesive framework.',
                        'Broad unit and integration test coverage ensures platform stability and fewer errors during growth and deployment.'
                    ]
                },
                slide34: {
                    title: '<i class="fa-solid fa-trophy"></i> AqarMind vs. Competitors',
                    headers: ['Feature', 'AqarMind', 'Aqarmap', 'OLX Real Estate', 'Nawy'],
                    labels: [
                        'Identity verification (Face ID / KYC)',
                        'Fake image detection (AI Vision)',
                        'Smart chatbot with background search',
                        'Automatic ownership document analysis',
                        'Installment risk assessment (AI Risk)',
                        'Company residential compound management',
                        'Innovative architecture + IEEE paper'
                    ],
                    footer: '<i class="fa-solid fa-star" style="color: var(--gold-color);"></i> AqarMind is the only local platform that combines biometric security, comprehensive AI, and company/compound management in one integrated product.'
                },
                slide35: {
                    title: '<i class="fa-solid fa-road"></i> Future Roadmap',
                    titles: ['Phase One', 'Phase Two', 'Phase Three', 'Phase Four'],
                    subtitles: ['Mobile App', 'Regional Expansion', 'Virtual VR Tours', 'Real Estate Blockchain'],
                    bodies: [
                        'Launch a React Native app for iOS and Android with the full platform experience.',
                        'Expand into GCC countries and adapt to each market\'s requirements.',
                        'Add virtual reality for 3D property tours without physical visits.',
                        'Notarize ownership contracts on blockchain for full transparency and decentralization.'
                    ],
                    footer: '<i class="fa-solid fa-rocket" style="color:var(--gold-color);"></i> The platform is designed with the scalable EDMMA architecture to absorb these phases without rewriting the core.'
                },
slide36: {
    title: '<i class="fa-solid fa-database"></i> Datasets and Training Data Sources',
    desc: 'AqarMind AI models are trained and evaluated using public benchmark datasets, proprietary production data, and custom-collected datasets developed by our team.',

    titles: [
        'Real Estate & Pricing Data (Part 1)',
        'Real Estate & Pricing Data (Part 2)',
        'Identity & Face Verification',
        'Document & Registry Inspection',
        'Image Tampering & Fraud Detection',
        'Natural Language & Financial Security',
        'Proprietary & Custom-Collected Data'
    ],

    bodies: [
        [
            '<a href="https://share.google/I7rDyKpGk5O1Z6bUE" target="_blank">Egypt-House-Prices-Predictor</a>',
            '<a href="https://share.google/W4JEjoJCXlg1zGqBj" target="_blank">egypt_House_prices</a>'
        ],

        [
            '<a href="https://share.google/3qBQHeLbeClNTVOzE" target="_blank">Egypt_Houses_Price</a>',
            '<a href="https://share.google/CSoA2ZvfQIFsboadY" target="_blank">Houses Price in Cairo New 2023</a>'
        ],

        [
            'LFW (Labeled Faces in the Wild)',
            'CelebA Face Dataset',
            'DeepFace Identity Matching',
            'Face Verification & Similarity Analysis'
        ],

        [
            'RVL-CDIP Document Dataset',
            'Custom Egyptian Property Deeds',
            'Commercial Register Documents',
            'OCR Annotated Legal Records'
        ],

        [
            'CASIA Image Tampering Database',
            'IMD2020 Image Manipulation Dataset',
            'Forgery & Photoshop Detection',
            'Image Compression Analysis'
        ],

        [
            'AraSenti-Twitter Dataset',
            'Custom Egyptian Dialect Dataset',
            'IEEE Fraud Detection Dataset',
            'Kaggle Credit Risk Dataset'
        ],

        [
            'Phone Number Dataset (Collected from Scratch)',
            'Spam & Scam Message Corpus',
            'Arabic Offensive & Profanity Dictionary',
            'Human-Labeled AI Training & Validation Samples'
        ]
    ]
},


                slide37: {
                    title: '<i class="fa-solid fa-graduation-cap"></i> Conclusion and Recommendations for 2026',
                    cardTitle: '<i class="fa-solid fa-quote-right"></i> Project Summary and Recommendations',
                    cardBody: 'AqarMind represents an integrated future vision for a smart and secure real estate market in 2026. By combining 45 AI models inside the event-driven EDMMA hybrid architecture powered by Apache Kafka, we eliminated real estate fraud gaps and automated 80% of inspection and review tasks with unprecedented efficiency.',
                    recHeading: '<i class="fa-solid fa-list-check" style="color: var(--gold-color);"></i> Key Strategic Recommendations (2026):',
                    recommendations: [
                        '<strong>Digital Government Integration:</strong> Connect the platform to national digital land registry databases for instant and full ownership verification.',
                        '<strong>Web3 Expansion:</strong> Introduce decentralized smart contracts through blockchain networks to prevent tampering with property records.',
                        '<strong>Language Model Improvement:</strong> Train LLMs on regional and colloquial dialects to better support Arab newcomers and expatriates.',
                        '<strong>Biometric Security Enhancement:</strong> Develop advanced AI-based liveness detection to block videos and still images from bypassing Face ID.'
                    ],
                    thankTitle: '🏆 Thank You for Your Attention',
                    thankText: 'AqarMind - the most secure and trustworthy smart real estate environment in Egypt and the Arab world',
                    footerDiv: '<strong>Supervised By:</strong> Prof. Mai El-Defrawi<br><strong>Project Development:</strong> AqarMind Team<br><strong>Graduation Project Defense — 2026</strong>'
                },
                slide38: {
                    desc: 'Unique Python packages used across the AI ecosystem and backend services. Repeated versions were removed and each package appears once only.',
                    cardTitles: [
                        'Web, API & Realtime',
                        'AI, Vision & Biometrics',
                        'Data, Messaging & Config',
                        'NLP, Math & Visualization',
                        'Runtime, Framework & Async'
                    ],
                    items: [
                        [
                            '<strong>Flask / flask-cors / Flask-SocketIO / python-socketio / python-engineio:</strong> API routing, browser CORS, and real-time event transport.',
                            '<strong>gunicorn / eventlet / simple-websocket / requests:</strong> production serving, async workers, websocket fallback, and outbound HTTP calls.'
                        ],
                        [
                            '<strong>numpy / Pillow / opencv-python / opencv-python-headless / opencv-contrib-python:</strong> image loading, array math, and computer vision processing.',
                            '<strong>mediapipe / deepface / tf-keras / nudenet / sounddevice:</strong> face landmarks, identity matching, moderation, and audio capture.',
                            '<strong>onnxruntime / torch / transformers / tokenizers / huggingface_hub / hf-xet / safetensors / flatbuffers / protobuf:</strong> model inference, NLP, and safe model distribution.'
                        ],
                        [
                            '<strong>pymongo / confluent-kafka / python-dotenv / dnspython:</strong> database access, event streaming, and environment configuration.',
                            '<strong>certifi / pytz / python-dateutil / PyYAML:</strong> certificates, time zones, date parsing, and YAML config.',
                            '<strong>filelock / fsspec / packaging / typing_extensions / idna / pyparsing:</strong> filesystem handling, packaging, and compatibility helpers.'
                        ],
                        [
                            '<strong>regex / rich / tqdm / Pygments / markdown-it-py / mdurl:</strong> text processing, styled output, progress bars, and markdown rendering.',
                            '<strong>matplotlib / contourpy / cycler / kiwisolver / fonttools:</strong> chart rendering, color cycles, layout, and font support.',
                            '<strong>sympy / mpmath / networkx:</strong> symbolic math and graph utilities.'
                        ],
                        [
                            '<strong>Jinja2 / MarkupSafe / Werkzeug / itsdangerous / blinker / bidict:</strong> Flask templates, routing, security tokens, signals, and event mapping.',
                            '<strong>click / typer / shellingham / colorama:</strong> command-line tooling and developer UX.',
                            '<strong>cffi / pycparser / absl-py / annotated-doc / six / setuptools:</strong> low-level compatibility, helpers, and build support.',
                            '<strong>httpx / httpcore / anyio / h11 / wsproto:</strong> modern HTTP clients, async transport, and protocol support.'
                        ]
                    ],
                    footer: 'Repeated versions were removed. The slide focuses on the unique Python packages that support the AI ecosystem and its production services.'
                }
            },
            ar: {
                slide30: {
                    title: '<i class="fa-solid fa-wrench"></i> التحديات التقنية وكيف تم حلّها',
                    titles: [
                        'التحدي: تجميع داتا سيت العقارات المصرية من مصادر ومنصات متعددة',
                        'التحدي: Real-time ingestion للبيانات من مصادر مباشرة ومتغيرة لحظياً',
                        'التحدي: ضوضاء البيانات وتضارب الأسعار والحقول الناقصة',
                        'التحدي: وسم بيانات الوثائق والوجه الحساسة على نطاق كبير',
                        'التحدي: معالجة الـ AI داخل المعمارية الجديدة بدون إبطاء النواة',
                        'التحدي: كشف التزوير في الصور والوثائق',
                        'التحدي: الدردشة الفورية والدفعات تحت الضغط'
                    ],
                    bodies: [
                        'الحل: جمعنا البيانات من منصات العقارات المصرية وعمليات scraping ومصادر داخلية، ثم وحّدنا الصيغ والأسعار والمصطلحات المحلية داخل EDMMA قبل أي تدريب أو تشغيل.',
                        'الحل: أنشأنا pipeline streaming داخل EDMMA يلتقط البيانات لحظياً، ثم يمررها عبر Kafka لتوحيدها ومزامنتها مع طبقات التخلاف والتشغيل.',
                        'الحل: طبقنا normalization للأسعار والوحدات، وتنظيفاً للشواذ، وسياسة imputation للحقول المفقودة حتى تصبح البيانات قابلة للتنبؤ والمقارنة.',
                        'الحل: اعتمدنا Human-in-the-Loop labeling مع مراجعة يدوية للعينات الحساسة وإخفاء البيانات الشخصية قبل إدخالها إلى التدريب.',
                        'الحل: فصلنا مهام الـ AI إلى خدمات غير متزامنة داخل EDMMA، ومررنا الأوامر الثقيلة عبر Kafka لتشغيلها بالتوازي دون التأثير على الأداء اللحظي.',
                        'الحل: FAISS للتشابه البصري + OCR لفحص النصوص + DeepFace لمطابقة الوجه في طبقات متوازية.',
                        'الحل: عزل خادم Flask مع Socket.IO كلياً عن النواة، وربط بوابات الدفع بمعايير PCI-DSS ونموذج Fraud Detection.'
                    ]
                },
                slide31: {
                    title: '<i class="fa-solid fa-lightbulb"></i> الدروس المستفادة',
                    titles: [
                        'ابدأ بالتصميم الهندسي قبل الكود',
                        'عزل الخدمات المتخصصة يصنع الفارق',
                        'الأمان ركيزة أساسية لا طبقة إضافية',
                        'الفريق متعدد التخصصات ميزة استراتيجية'
                    ],
                    bodies: [
                        'قرار اعتماد EDMMA من البداية وفّر إعادة كتابة الكود أكثر من مرة وأعطانا مرونة لإضافة خدمات AI بسهولة تامة.',
                        'فصل Flask كخادم مستقل للدردشة عن .NET Core أنقذنا من اختناقات الأداء وسمح بالتوسع المستقل لكل خدمة.',
                        'بناء 2FA وFace ID وRBAC من اليوم الأول هو القرار الصواب؛ إضافتها لاحقاً كانت ستكون مكلفة ومعقدة.',
                        'توزيع العمل بين متخصصي Backend وFrontend وAI وDevOps بالتوازي ضاعف الإنتاجية وقلّص وقت التطوير بشكل ملحوظ.'
                    ]
                },
                slide32: {
                    title: '<i class="fa-solid fa-desktop"></i> أبرز شاشات المنصة',
                    titles: [
                        '<i class="fa-solid fa-magnifying-glass"></i> شاشة البحث الدلالي',
                        '<i class="fa-solid fa-robot"></i> شاشة الشات بوت الذكي',
                        '<i class="fa-solid fa-gauge-high"></i> لوحة تحكم المالك / الشركة',
                        '<i class="fa-solid fa-file-signature"></i> شاشة العقد الذكي'
                    ],
                    bodies: [
                        'فهم نية البحث وعرض النتائج بترتيب معنوي لا حرفي.',
                        'المستشار العقاري مع Match Score وبحث مستمر في الخلفية.',
                        'إدارة الإعلانات والعروض والعقود وحالة التحقق.',
                        'مراجعة بنود العقد وكشف المخاطر القانونية قبل التوقيع الإلكتروني.'
                    ]
                },
                slide33: {
                    title: '<i class="fa-solid fa-graduation-cap"></i> نقاط تميز مشروع التخرج للتقييم الأكاديمي',
                    titles: [
                        '<i class="fa-solid fa-book-open"></i> نشر البحث العلمي (TechRxiv)',
                        '<i class="fa-solid fa-code-branch"></i> جودة الكود وبنية الإنتاج',
                        '<i class="fa-solid fa-brain"></i> شمولية الذكاء الاصطناعي',
                        '<i class="fa-solid fa-vial"></i> اختبارات الكود التلقائية'
                    ],
                    bodies: [
                        'المشروع مبني على تصميم هندسي وبحث معتمد أكاديمياً تم نشره في مستودعات IEEE TechRxiv، مما يثبت الابتكار والجدية الأكاديمية لمعمارية EDMMA.',
                        'بيئة برمجية متكاملة تماثل كبرى الشركات البرمجية (Production-Grade) باستخدام تقنيات مثل Apache Kafka و Docker و FAISS و SQL Server و MongoDB معاً.',
                        'عدم الاكتفاء بموديل واحد أو ميزة بسيطة، بل دمج محركات معالجة وثائق، رؤية حاسوبية، سلاسل زمنية، معالجة لغات طبيعية، ونظم توصيات في إطار واحد متجانس.',
                        'تغطية برمجية شاملة بوحدات اختبارية (Unit & Integration Tests) تضمن ثبات المنصة وخلوها من الأخطاء أثناء التوسع والتشغيل.'
                    ]
                },
                slide34: {
                    title: '<i class="fa-solid fa-trophy"></i> AqarMind مقارنةً بالمنافسين',
                    headers: ['وجه المقارنة', 'AqarMind', 'Aqarmap', 'OLX عقارات', 'Nawy'],
                    labels: [
                        'التحقق من الهوية (Face ID / KYC)',
                        'كشف الصور المزيفة (AI Vision)',
                        'شات بوت ذكي مع بحث في الخلفية',
                        'تحليل مستندات الملكية آلياً',
                        'تقييم مخاطر الأقساط (AI Risk)',
                        'إدارة مجمعات سكنية للشركات',
                        'معمارية مبتكرة + ورقة بحثية IEEE'
                    ],
                    footer: '<i class="fa-solid fa-star" style="color: var(--gold-color);"></i> AqarMind الوحيد في السوق المحلي الذي يجمع بين الأمان البيومتري، الذكاء الاصطناعي الشامل، وإدارة الشركات والمجمعات السكنية في منصة واحدة متكاملة.'
                },
                slide35: {
                    title: '<i class="fa-solid fa-road"></i> خارطة طريق المستقبل',
                    titles: ['المرحلة الأولى', 'المرحلة الثانية', 'المرحلة الثالثة', 'المرحلة الرابعة'],
                    subtitles: ['تطبيق الجوال', 'التوسع الإقليمي', 'جولات VR افتراضية', 'بلوكتشين العقارات'],
                    bodies: [
                        'إطلاق تطبيق React Native لنظامَي iOS وAndroid مع كامل ميزات المنصة.',
                        'توسيع المنصة لدول الخليج العربي والتكيّف مع متطلبات كل سوق.',
                        'دمج الواقع الافتراضي لجولات عقارية ثلاثية الأبعاد بدون زيارة.',
                        'توثيق عقود الملكية عبر Blockchain لضمان شفافية ولا مركزية كاملة.'
                    ],
                    footer: '<i class="fa-solid fa-rocket" style="color:var(--gold-color);"></i> المنصة مصممة أصلاً بمعمارية EDMMA قابلة للتوسع لاستيعاب هذه المراحل دون إعادة كتابة النواة.'
                },
                slide36: {
                    title: '<i class="fa-solid fa-database"></i> مصادر البيانات ومجموعات التدريب',
                    desc: 'تم تدريب وتقييم نماذج الذكاء الاصطناعي في منصة AqarMind باستخدام مجموعات بيانات ضخمة ومتنوعة:',
                    titles: [
                        'بيانات العقارات والأسعار',
                        'التحقق من الهوية والوجه',
                        'فحص الوثائق والسجلات',
                        'كشف تعديل وتزوير الصور',
                        'اللغات الطبيعية والشات بوت',
                        'الأمان المالي والمخاطر'
                    ],
                    bodies: [
                        ['Kaggle Real Estate: مجموعة بيانات عروض العقارات بمصر والوطن العربي (أكثر من 150 ألف سجل).', 'Web Scraping Data: تجميع وتصنيف بيانات العروض الحية والأسعار التاريخية من منصات عقارية محلية لتغذية محرك التوصيات.'],
                        ['LFW (Labeled Faces in the Wild): لتدقيق خوارزميات DeepFace والتحقق من الملامح وتطابق الهوية الحيوية.', 'CelebA Dataset: لتحسين دقة استخراج الوجه وعزل الضوضاء والإضاءة المحيطة أثناء التحقق بالوجه.'],
                        ['RVL-CDIP Dataset: لتدريب موديل تصنيف وتوجيه المستندات والصور الضوئية تلقائياً.', 'Custom Annotated Dataset: مجموعة بيانات مصنفة محلياً تضم نماذج صكوك ملكية وسجلات تجارية وبطاقات هوية مصرية للتوافق مع المستندات القانونية.'],
                        ['CASIA Image Tampering Database: مجموعة بيانات قياسية عالمية تستخدم لكشف القص واللصق والتلاعب بالبكسل والتعديلات الرقمية (Photoshop).', 'IMD2020: لتدريب النماذج على فحص الضغط وفهم طبقات الصور المرفوعة.'],
                        ['AraSenti-Twitter Dataset: لتدريب موديل تحليل مشاعر النصوص ورصد التعديات والسمية اللفظية.', 'Custom Dialect Dataset: تجميع مدونات محادثة باللهجة المصرية الدارجة والمصطلحات العقارية المحلية لرفع كفاءة فهم نية الباحث واستخلاص المعاني.'],
                        ['Kaggle Credit Risk Dataset: لتدريب خوارزميات تقييم احتمالية التعثر في سداد الأقساط الشهرية.', 'IEEE Fraud Detection: لبناء وتدريب نموذج كشف سلوكيات الدفع المشبوهة وحماية بوابات الدفع الإلكتروني.']
                    ]
                },
                slide37: {
                    title: '<i class="fa-solid fa-graduation-cap"></i> الخاتمة والتوصيات لعام 2026',
                    cardTitle: '<i class="fa-solid fa-quote-right"></i> خلاصة وتوصيات المشروع',
                    cardBody: 'يمثل مشروع AqarMind رؤية مستقبلية متكاملة لسوق عقاري ذكي وآمن بحلول عام 2026. من خلال دمج 45 نموذج ذكاء اصطناعي داخل معمارية EDMMA الهجينة المبنية على الحدث عبر Apache Kafka، تمكنا من القضاء التام على ثغرات النصب العقاري وأتمتة 80% من عمليات الفحص والمراجعة بكفاءة غير مسبوقة.',
                    recHeading: '<i class="fa-solid fa-list-check" style="color: var(--gold-color);"></i> أهم التوصيات الاستراتيجية (2026):',
                    recommendations: [
                        '<strong>التكامل الحكومي الرقمي:</strong> ربط المنصة بقواعد بيانات الشهر العقاري القومي الرقمي للتحقق الفوري والكامل من سندات الملكية.',
                        '<strong>التوسع في تقنيات Web3:</strong> إدخل العقود الذكية اللامركزية عبر شبكات البلوكتشين لضمان عدم التلاعب بسجلات العقارات.',
                        '<strong>تحسين النماذج اللغوية:</strong> تدريب نماذج فهم اللغات الطبيعية LLMs على اللهجات الإقليمية والدارجة لتقديم دعم أفضل للوافدين العرب والمغتربين.',
                        '<strong>تعزيز الأمان الحيوي:</strong> تطوير تقنيات كشف الحيوية (Liveness Detection) المتقدمة بالـ AI لمنع استخدام الفيديو والصور الساكنة لتخطي الـ Face ID.'
                    ],
                    thankTitle: '🏆 شكراً لحسن استماعكم',
                    thankText: 'منصة AqarMind — البيئة العقارية الذكية الأكثر أماناً وموثوقية في مصر والوطن العربي',
                    footerDiv: '<strong>تحت إشراف:</strong> د. مي الدفراوي (Prof. Mai El-Defrawi)<br><strong>تطوير المشروع:</strong> فريق عمل AqarMind<br><strong>مناقشة مشروع التخرج — لعام 2026</strong>'
                },
                slide38: {
                    desc: 'حِزم بايثون فريدة مستخدمة عبر منظومة الذكاء الاصطناعي وخدمات الخلفية. تم حذف الإصدارات المكررة وكل حزمة تظهر مرة واحدة فقط.',
                    cardTitles: [
                        'خدمات الويب وواجهة الوقت الحقيقي',
                        'الذكاء الاصطناعي والرؤية والتحقق البيومتري',
                        'البيانات والرسائل والإعدادات',
                        'معالجة النصوص والرياضيات والرسوم',
                        'دعم الإطار والتوافق والاتصال غير المتزامن'
                    ],
                    items: [
                        [
                            '<strong>Flask / flask-cors / Flask-SocketIO / python-socketio / python-engineio:</strong> توجيه الـ APIs، ودعم CORS، ونقل الأحداث اللحظي.',
                            '<strong>gunicorn / eventlet / simple-websocket / requests:</strong> التشغيل الإنتاجي، والعمال غير المتزامنين، وبديل WebSocket، وطلبات HTTP الخارجية.'
                        ],
                        [
                            '<strong>numpy / Pillow / opencv-python / opencv-python-headless / opencv-contrib-python:</strong> تحميل الصور، وحساب المصفوفات، ومعالجة الرؤية الحاسوبية.',
                            '<strong>mediapipe / deepface / tf-keras / nudenet / sounddevice:</strong> ملامح الوجه، ومطابقة الهوية، والاعتدال، والتقاط الصوت.',
                            '<strong>onnxruntime / torch / transformers / tokenizers / huggingface_hub / hf-xet / safetensors / flatbuffers / protobuf:</strong> استدلال النماذج، وNLP، وتوزيع النماذج بشكل آمن.'
                        ],
                        [
                            '<strong>pymongo / confluent-kafka / python-dotenv / dnspython:</strong> الوصول لقواعد البيانات، وبث الأحداث، وضبط الإعدادات.',
                            '<strong>certifi / pytz / python-dateutil / PyYAML:</strong> الشهادات، والمناطق الزمنية، وتحليل التاريخ، وملفات YAML.',
                            '<strong>filelock / fsspec / packaging / typing_extensions / idna / pyparsing:</strong> التعامل مع الملفات، والتغليف، ومساعدات التوافق.'
                        ],
                        [
                            '<strong>regex / rich / tqdm / Pygments / markdown-it-py / mdurl:</strong> معالجة النصوص، والمخرجات المنسقة، وشريط التقدم، وعرض Markdown.',
                            '<strong>matplotlib / contourpy / cycler / kiwisolver / fonttools:</strong> رسم المخططات، ودورات الألوان، والتخطيط، ودعم الخطوط.',
                            '<strong>sympy / mpmath / networkx:</strong> رياضيات رمزية وأدوات للرسم البياني.'
                        ],
                        [
                            '<strong>Jinja2 / MarkupSafe / Werkzeug / itsdangerous / blinker / bidict:</strong> قوالب Flask، والتوجيه، والرموز الآمنة، والإشعارات، وربط الأحداث.',
                            '<strong>click / typer / shellingham / colorama:</strong> أدوات سطر الأوامر وتجربة المطور.',
                            '<strong>cffi / pycparser / absl-py / annotated-doc / six / setuptools:</strong> التوافق منخفض المستوى، والمساعدات، ودعم البناء.',
                            '<strong>httpx / httpcore / anyio / h11 / wsproto:</strong> عملاء HTTP حديثون، والنقل غير المتزامن، ودعم البروتوكولات.'
                        ]
                    ],
                    footer: 'تم حذف الإصدارات المكررة. الشريحة تركز على الحِزم الفريدة التي تدعم منظومة الذكاء الاصطناعي وخدمات الإنتاج.'
                }
            }
        };

        const targetData = contentData[lang];

        // ==================== SLIDE 30 ====================
        const slide30 = document.querySelector('#slide-30');
        if (slide30 && targetData.slide30) {
            setHTML(slide30.querySelector('.slide-title'), targetData.slide30.title);
            const challengeTitles = slide30.querySelectorAll('.card.glass h4');
            const challengeTexts = slide30.querySelectorAll('.card.glass p');
            challengeTitles.forEach((card, i) => {
                if (i < targetData.slide30.titles.length) setHTML(card, targetData.slide30.titles[i]);
            });
            challengeTexts.forEach((card, i) => {
                if (i < targetData.slide30.bodies.length) setHTML(card, targetData.slide30.bodies[i]);
            });
        }

        // ==================== SLIDE 31 ====================
        const slide31 = document.querySelector('#slide-31');
        if (slide31 && targetData.slide31) {
            setHTML(slide31.querySelector('.slide-title'), targetData.slide31.title);
            const lessonTitles = slide31.querySelectorAll('.card.glass h4');
            const lessonTexts = slide31.querySelectorAll('.card.glass p');
            lessonTitles.forEach((card, i) => {
                if (i < targetData.slide31.titles.length) setText(card, targetData.slide31.titles[i]);
            });
            lessonTexts.forEach((card, i) => {
                if (i < targetData.slide31.bodies.length) setText(card, targetData.slide31.bodies[i]);
            });
        }

        // ==================== SLIDE 32 ====================
        const slide32 = document.querySelector('#slide-32');
        if (slide32 && targetData.slide32) {
            setHTML(slide32.querySelector('.slide-title'), targetData.slide32.title);
            const screenTitles = slide32.querySelectorAll('.card.glass h4');
            const screenTexts = slide32.querySelectorAll('.card.glass p');
            screenTitles.forEach((card, i) => {
                if (i < targetData.slide32.titles.length) setHTML(card, targetData.slide32.titles[i]);
            });
            screenTexts.forEach((card, i) => {
                if (i < targetData.slide32.bodies.length) setText(card, targetData.slide32.bodies[i]);
            });
        }

        // ==================== SLIDE 33 ====================
        const slide33 = document.querySelector('#slide-33');
        if (slide33 && targetData.slide33) {
            setHTML(slide33.querySelector('.slide-title'), targetData.slide33.title);
            const strengthTitles = slide33.querySelectorAll('.card.glass h3');
            const strengthTexts = slide33.querySelectorAll('.card.glass p');
            strengthTitles.forEach((card, i) => {
                if (i < targetData.slide33.titles.length) setHTML(card, targetData.slide33.titles[i]);
            });
            strengthTexts.forEach((card, i) => {
                if (i < targetData.slide33.bodies.length) setText(card, targetData.slide33.bodies[i]);
            });
        }

        // ==================== SLIDE 34 ====================
        const slide34 = document.querySelector('#slide-34');
        if (slide34 && targetData.slide34) {
            setHTML(slide34.querySelector('.slide-title'), targetData.slide34.title);
            const ths = slide34.querySelectorAll('thead th');
            ths.forEach((th, i) => {
                if (i < targetData.slide34.headers.length) setText(th, targetData.slide34.headers[i]);
            });
            const rows = slide34.querySelectorAll('tbody tr');
            rows.forEach((row, i) => {
                const firstCell = row.querySelector('td');
                if (firstCell && i < targetData.slide34.labels.length) setText(firstCell, targetData.slide34.labels[i]);
            });
            const footerPara = slide34.querySelector('p');
            if (footerPara) setHTML(footerPara, targetData.slide34.footer);
        }

        // ==================== SLIDE 35 ====================
        const slide35 = document.querySelector('#slide-35');
        if (slide35 && targetData.slide35) {
            setHTML(slide35.querySelector('.slide-title'), targetData.slide35.title);
            const cards = slide35.querySelectorAll('.card.glass');
            cards.forEach((card, i) => {
                if (i < targetData.slide35.titles.length) {
                    const h4 = card.querySelector('h4');
                    const h3 = card.querySelector('h3');
                    const p = card.querySelector('p');
                    if (h4) setText(h4, targetData.slide35.titles[i]);
                    if (h3) setText(h3, targetData.slide35.subtitles[i]);
                    if (p) setText(p, targetData.slide35.bodies[i]);
                }
            });
            const roadmapFooter = slide35.querySelector('p:last-of-type');
            if (roadmapFooter) setHTML(roadmapFooter, targetData.slide35.footer);
        }

        // ==================== SLIDE 36 ====================
        const slide36 = document.querySelector('#slide-36');
        if (slide36 && targetData.slide36) {
            setHTML(slide36.querySelector('.slide-title'), targetData.slide36.title);
            setText(slide36.querySelector('.slide-description'), targetData.slide36.desc);
            const cards = slide36.querySelectorAll('.card.glass');
            cards.forEach((card, i) => {
                if (i < targetData.slide36.titles.length) {
                    const h4 = card.querySelector('h4');
                    if (h4) setText(h4, targetData.slide36.titles[i]);
                    const items = card.querySelectorAll('li');
                    if (items.length >= 2) {
                        setHTML(items[0], targetData.slide36.bodies[i][0]);
                        setHTML(items[1], targetData.slide36.bodies[i][1]);
                    }
                }
            });
        }

        // ==================== SLIDE 37 ====================
        const slide37 = document.querySelector('#slide-37');
        if (slide37 && targetData.slide37) {
            setHTML(slide37.querySelector('.slide-title'), targetData.slide37.title);
            const mainCard = slide37.querySelector('.card.glass:first-child');
            if (mainCard) {
                const mainTitle = mainCard.querySelector('h3');
                const mainPara = mainCard.querySelector('p');
                if (mainTitle) setHTML(mainTitle, targetData.slide37.cardTitle);
                if (mainPara) setText(mainPara, targetData.slide37.cardBody);
                const recHeading = mainCard.querySelector('h4');
                if (recHeading) setHTML(recHeading, targetData.slide37.recHeading);
                const recItems = mainCard.querySelectorAll('.styled-list li');
                recItems.forEach((item, i) => {
                    if (i < targetData.slide37.recommendations.length) setHTML(item, targetData.slide37.recommendations[i]);
                });
            }
            const secondCard = slide37.querySelectorAll('.card.glass')[1];
            if (secondCard) {
                const thankTitle = secondCard.querySelector('h3');
                const thankText = secondCard.querySelector('p');
                if (thankTitle) setHTML(thankTitle, targetData.slide37.thankTitle);
                if (thankText) setText(thankText, targetData.slide37.thankText);
                const footerDiv = secondCard.querySelector('div:last-child');
                if (footerDiv) setHTML(footerDiv, targetData.slide37.footerDiv);
            }
        }

        // ==================== SLIDE 38 ====================
        const slide38 = document.querySelector('#slide-38');
        if (slide38 && targetData.slide38) {
            const titleNode = slide38.querySelector('.slide-title');
            const descNode = slide38.querySelector('.slide-description');
            const cardTitles = slide38.querySelectorAll('.library-card h3');
            const cards = slide38.querySelectorAll('.library-card');
            const footerNode = slide38.querySelector('.card.glass:last-of-type p');

            if (titleNode) setHTML(titleNode, lang === 'ar'
                ? '<i class="fa-solid fa-plug"></i> المكتبات الأساسية والاعتمادات'
                : '<i class="fa-solid fa-plug"></i> Core Libraries & Dependencies');
            if (descNode) setText(descNode, targetData.slide38.desc || descNode.textContent);

            cardTitles.forEach((card, i) => {
                if (i < targetData.slide38.cardTitles.length) setText(card, targetData.slide38.cardTitles[i]);
            });

            cards.forEach((card, i) => {
                const items = card.querySelectorAll('li');
                const sourceItems = targetData.slide38.items?.[i] || [];
                items.forEach((item, itemIndex) => {
                    if (itemIndex < sourceItems.length) {
                        setHTML(item, sourceItems[itemIndex]);
                    }
                });
            });

            if (footerNode) setText(footerNode, targetData.slide38.footer);
        }
    }

    function applyAiEcosystemMapCopy(lang) {
        const slide9 = document.querySelector('#slide-9');
        if (!slide9) return;

        const setText = (root, selector, value) => {
            const node = root.querySelector(selector);
            if (node && value !== undefined) node.textContent = value;
        };
        const setHTML = (root, selector, value) => {
            const node = root.querySelector(selector);
            if (node && value !== undefined) node.innerHTML = value;
        };
        const setList = (root, selector, values) => {
            root.querySelectorAll(selector).forEach((node, index) => {
                if (values[index] !== undefined) node.textContent = values[index];
            });
        };

        const data = {
            en: {
                title: '<i class="fa-solid fa-brain"></i> The 45 AI Core Functions Map',
                description: 'The system incorporates 45 purpose-built algorithms grouped into 10 distinct operational layers to orchestrate total compliance and transaction safety:',
                cards: [
    ['doc', '1. Document Intelligence', '5 Functions', [
        'Ownership Doc Analysis',
        'Commercial Register Analysis',
        'Post Doc Analysis',
        'Project Doc Analysis',
        'Document Analysis Core'
    ]],

    ['vision', '2. Computer Vision', '3 Functions', [
        'Image Manipulation Detection',
        'Image Quality Scoring',
        'Similar Listings Detection'
    ]],

    ['security', '3. Security & Anti-Fraud', '4 Functions', [
        'Face ID Matching',
        'Fake Property Detection',
        'Payment Fraud Detection',
        'User Anomaly Detection'
    ]],

    ['pricing', '4. Market Analytics & Pricing', '6 Functions', [
        'Price Anomaly Detection',
        'Price Suggestion Engine',
        'Price Forecasting Loops',
        'Market Trends Analysis',
        'Demand Prediction Context',
        'Demand Forecasting Matrix'
    ]],

    ['finance', '5. Financial Risk Assessment', '4 Functions', [
        'Installment Risk Assessment',
        'Rent Eligibility Assessment',
        'Decision Engine Core',
        'Band Suggestion Handler'
    ]],

    ['contracts', '6. Smart Contracts & Deals', '3 Functions', [
        'Contract Risk Flagging',
        'Contract Clause Suggestion',
        'Counter Offer Suggestion'
    ]],

    ['search', '7. Semantic Search & Recomm.', '6 Functions', [
        'Query Understanding',
        'Semantic Ranking Core',
        'Similar Listings Detection',
        'Personalized Feed Loop',
        'Related Posts Recommendation',
        'User-to-User Matching'
    ]],

    ['nlp', '8. NLP & Conversational AI', '4 Functions', [
        'AI Agent / Assistant Core',
        'Text Proposals Generator',
        'Auto Reply Suggestion',
        'Language Detection Node'
    ]],

    ['moderation', '9. Content Safety & Moderation', '5 Functions', [
        'Content Moderation Engine',
        'Spam Detection Context',
        'Toxicity Scoring Model',
        'Sentiment Analysis Loop',
        'Blocked Suggestions Node'
    ]],

    ['support', '10. Intelligent Support', '5 Functions', [
        'Ticket Classification',
        'Priority Scoring Logic',
        'Smart Report Analysis',
        'Offer Ranking Sort',
        'User Behavior Summary'
    ]]
]
            },
            ar: {
                title: '<i class="fa-solid fa-brain"></i> خريطة وظائف الذكاء الاصطناعي الـ 45',
                description: 'تضم المنصة 45 خوارزمية مخصصة موزعة على 10 طبقات تشغيلية متكاملة لتنظيم الامتثال الكامل وسلامة المعاملات.',
                cards: [
    ['doc', '1. ذكاء المستندات', '5 وظائف', [
        'تحليل مستندات الملكية',
        'تحليل السجل التجاري',
        'تحليل مستندات الإعلان',
        'تحليل مستندات المشروع',
        'النواة التحليلية للمستندات'
    ]],

    ['vision', '2. الرؤية الحاسوبية', '3 وظائف', [
        'كشف التلاعب بالصور',
        'تقييم جودة الصورة',
        'كشف الإعلانات المتشابهة'
    ]],

    ['security', '3. الأمن ومكافحة الاحتيال', '4 وظائف', [
        'مطابقة Face ID',
        'كشف العقار المزيف',
        'كشف الاحتيال في الدفع',
        'كشف سلوكيات الشذوذ'
    ]],

    ['pricing', '4. تحليلات السوق والتسعير', '6 وظائف', [
        'كشف شذوذ الأسعار',
        'محرك اقتراح الأسعار',
        'تنبؤات الأسعار',
        'تحليل اتجاهات السوق',
        'توقع الطلب',
        'مصفوفة توقع الطلب'
    ]],

    ['finance', '5. التقييم المالي والمخاطر', '4 وظائف', [
        'تقييم مخاطر الأقساط',
        'تقييم أهلية الإيجار',
        'النواة القرارية',
        'معالج اقتراح النطاق'
    ]],

    ['contracts', '6. العقود الذكية والصفقات', '3 وظائف', [
        'رصد مخاطر العقد',
        'اقتراح بنود العقد',
        'اقتراح العرض المقابل'
    ]],

    ['search', '7. البحث الدلالي والتوصيات', '6 وظائف', [
        'فهم الاستعلام',
        'النواة الدلالية للترتيب',
        'كشف الإعلانات المتشابهة',
        'التغذية المخصصة',
        'توصية المنشورات المرتبطة',
        'مطابقة مستخدم بمستخدم'
    ]],

    ['nlp', '8. الذكاء الحواري ومعالجة اللغة', '4 وظائف', [
        'نواة الوكيل / المساعد الذكي',
        'مولد المقترحات النصية',
        'اقتراح الردود التلقائية',
        'اكتشاف اللغة'
    ]],

    ['moderation', '9. سلامة واعتدال المحتوى', '5 وظائف', [
        'محرك الاعتدال',
        'كشف الرسائل المزعجة',
        'نموذج قياس السمية',
        'تحليل المشاعر',
        'عقدة الاقتراحات المحظورة'
    ]],

    ['support', '10. الدعم الذكي', '5 وظائف', [
        'تصنيف التذاكر',
        'منطق تحديد الأولوية',
        'تحليل البلاغات الذكي',
        'ترتيب العروض',
        'ملخص سلوك المستخدم'
    ]]
]
            }
        };

        const map = data[lang] || data.en;
        setHTML(slide9, '.slide-title', map.title);
        setText(slide9, '.slide-description', map.description);

        const container = slide9.querySelector('.ai-categories-container');
        if (!container) return;

        map.cards.forEach(([cat, title, count, features]) => {
            const card = slide9.querySelector(`.ai-cat-card[data-cat="${cat}"]`);
            if (!card) return;
            container.appendChild(card);
            setText(card, 'h3', title);
            setText(card, '.cat-count', count);
            setList(card, 'li', features);
        });
    }

    function applyArabicStaticCopy() {
        const setText = (root, selector, value) => {
            const node = root.querySelector(selector);
            if (node && value !== undefined) node.textContent = value;
        };
        const setHTML = (root, selector, value) => {
            const node = root.querySelector(selector);
            if (node && value !== undefined) node.innerHTML = value;
        };
        const setList = (root, selector, values) => {
            root.querySelectorAll(selector).forEach((node, index) => {
                if (values[index] !== undefined) node.textContent = values[index];
            });
        };

        const slide6 = document.querySelector('#slide-6');
        if (slide6) {
            setHTML(slide6, '.slide-title', '<i class="fa-solid fa-sitemap"></i> التصميم المعماري الأساسي: EDMMA مع Apache Kafka');
            setText(slide6, '.card.glass h3', 'لماذا نختار معمارية أحادية معيارية قائمة على الأحداث (EDMMA)؟');
            const li6 = slide6.querySelectorAll('.card.glass li');
            if (li6[0]) li6[0].innerHTML = '<i class="fa-solid fa-arrow-right"></i> <strong>مشكلة الميكروسيرفسز:</strong> تُدخل تعقيداً تشغيلياً هائلاً، وتكلفة شبكية عالية، وتتبعاً معقداً للبيانات عبر الحدود.';
            if (li6[1]) li6[1].innerHTML = '<i class="fa-solid fa-arrow-right"></i> <strong>عيب المونوليث التقليدي:</strong> يعاني من اختناقات أداء شديدة وتوقفات عند التعامل المتزامن مع أحمال الذكاء الاصطناعي الثقيلة.';
            if (li6[2]) li6[2].innerHTML = '<i class="fa-solid fa-circle-check" style="color: var(--teal-color)"></i> <strong>الخيار الهجين:</strong> يُبقي النواة الأساسية نظيفة وآمنة داخل C# .NET Core، بينما يرحّل المهام الثقيلة بشكل غير متزامن عبر Apache Kafka إلى عُقد Python.';
            const nodes6 = slide6.querySelectorAll('.flow-node');
            if (nodes6[0]) nodes6[0].textContent = 'النواة الأحادية C#';
            if (nodes6[1]) nodes6[1].textContent = 'Apache Kafka';
            if (nodes6[2]) nodes6[2].textContent = 'خدمات الذكاء الاصطناعي بـ Python';
            const arrows6 = slide6.querySelectorAll('.flow-arrow');
            if (arrows6[0]) arrows6[0].innerHTML = 'الأحداث <i class="fa-solid fa-arrow-right"></i>';
            if (arrows6[1]) arrows6[1].innerHTML = 'المعالجة <i class="fa-solid fa-arrow-right"></i>';
        }

        const slide7 = document.querySelector('#slide-7');
        if (slide7) {
            setHTML(slide7, '.slide-title', '<i class="fa-solid fa-chart-line"></i> مؤشرات أداء المعمارية (من الورقة البحثية)');
            setText(slide7, '.slide-description', 'تُظهر التقييمات التجريبية المكاسب الكبيرة في القابلية للتوسع وسرعة التنفيذ التي يحققها النموذج الهجين.');
            setList(slide7, '.metric-card h4', ['زمن استجابة النظام', 'سرعة الاسترداد', 'التعقيد التشغيلي']);
            setText(slide7, '.table-container th:nth-child(1)', 'مصفوفة التقييم');
            const ths7 = slide7.querySelectorAll('th');
            if (ths7[1]) ths7[1].textContent = 'المعمارية المقترحة (EDMMA)';
            if (ths7[2]) ths7[2].textContent = 'نمط الميكروسيرفسز';
            if (ths7[3]) ths7[3].textContent = 'المونوليث التقليدي';
            const rowTexts7 = [
                ['معدل نقل النظام', 'مكافئ للميكروسيرفسز', 'مرتفع جداً', 'يتدهور تحت الحمل العالي للذكاء الاصطناعي'],
                ['عزل الأعطال', 'ممتاز (عبر Kafka Streams)', 'ممتاز', 'ضعيف (نقطة فشل واحدة)'],
                ['سرعة التطوير / البرمجة', 'متوسطة-عالية (حدود نظيفة)', 'صعب جداً ومجزأ', 'عالية جداً في البداية']
            ];
            slide7.querySelectorAll('tbody tr').forEach((row, r) => {
                const tds = row.querySelectorAll('td');
                rowTexts7[r]?.forEach((v, c) => { if (tds[c]) tds[c].textContent = v; });
            });
            setText(slide7, '.badge.green', 'معدل الأتمتة 80%');
            const badges7 = slide7.querySelectorAll('.badge');
            if (badges7[0]) badges7[0].textContent = 'معدل الأتمتة 80%';
            if (badges7[1]) badges7[1].textContent = 'مطابقة للميكروسيرفسز';
            if (badges7[2]) badges7[2].textContent = 'ممتاز عبر Kafka';
            if (badges7[3]) badges7[3].textContent = 'متوسط-عالٍ';
        }

        const slide8 = document.querySelector('#slide-8');
        if (slide8) {
            setHTML(slide8, '.slide-title', '<i class="fa-solid fa-cubes"></i> حزمة التقنيات والسياقات متعددة اللغات');
            setText(slide8, '.slide-description', 'تستخدم المنظومة لغات وأطر عمل متخصصة ومصممة لكل مجال من مجالاتها المحددة.');
            const cards8 = slide8.querySelectorAll('.card.glass');
            if (cards8[0]) {
                cards8[0].querySelector('h3').innerHTML = '<i class="fa-solid fa-layer-group"></i> طبقات المعمارية والخدمات';
                const labels = cards8[0].querySelectorAll('.grid-3 h4');
                const bodies = cards8[0].querySelectorAll('.grid-3 p');
                const titles = ['1. React.js (SPA)', '2. .NET 8 Core', '3. Python Flask', '4. FastAPI', '5. Apache Kafka', '6. قاعدة بيانات متعددة اللغات'];
                const descs = [
                    'بناء لوحات تحكم فاخرة وسريعة الاستجابة بتأثير Glassmorphism.',
                    'تأمين خطوط المعالجة التجارية، وسجلات الحسابات، وقواعد المجال الأساسية.',
                    'تنسيق بروتوكولات دردشة لحظية متعددة المستخدمين مع حالة متزامنة.',
                    'تقديم نماذج AI غير متزامنة باستهلاك منخفض للموارد.',
                    'طبقة رسائل عالية الإنتاجية لإدارة الاتصال بين الخدمات.',
                    'SQL Server للأمان المعاملاتي وMongoDB للدردشة والإعلانات.'
                ];
                labels.forEach((n, i) => n.innerHTML = `<i class="${n.querySelector('i')?.className || ''}"></i> ${titles[i]}`);
                bodies.forEach((n, i) => n.textContent = descs[i]);
            }
            if (cards8[1]) {
                cards8[1].querySelector('h3').innerHTML = '<i class="fa-solid fa-language"></i> لغات البرمجة';
                const labels = cards8[1].querySelectorAll('.grid-3 h4');
                const bodies = cards8[1].querySelectorAll('.grid-3 p');
                const titles = ['C#', 'Python', 'JavaScript', 'T-SQL', 'Bash / YAML'];
                const descs = [
                    'تشغيل النواة الخلفية للمعاملات.',
                    'تشغيل التدريب وتدفق البيانات وميزات الشات.',
                    'الواجهة الأمامية والرسوميات التفاعلية.',
                    'إدارة الخرائط والعلاقات والفهارس المالية.',
                    'إدارة سكربتات Docker وتهيئة البيئة.'
                ];
                labels.forEach((n, i) => n.innerHTML = `${n.querySelector('i')?.outerHTML || ''} ${titles[i]}`);
                bodies.forEach((n, i) => n.textContent = descs[i]);
            }
        }

        const slide10 = document.querySelector('#slide-10');
        if (slide10) {
            setHTML(slide10, '.slide-title', '<i class="fa-solid fa-file-invoice"></i> 1. ذكاء المستندات والتحقق الذكي');
            setList(slide10, '.features-list strong', [
                'تحليل مستندات الملكية',
                'تحليل السجل التجاري',
                'تحليل مستندات الإعلان',
                'تحليل مستندات المشروع',
                'النواة التحليلية للمستندات'
            ]);
            setList(slide10, '.features-list p', [
                'فحص آلي لصكوك الملكية والسجلات والشهادات لضمان التحقق القانوني الكامل ومنع إسناد الأصول بشكل مزيف.',
                'استخراج البيانات الوصفية من التراخيص التجارية الخاصة بمطوري العقارات للتحقق من الحالة التشغيلية والمصداقية.',
                'مقارنة المرفقات المرفوعة مع الحقول النصية المُدخلة يدوياً لمنع الإعلانات المضللة أو المتناقضة.',
                'تحليل المخططات الهندسية والجداول الزمنية ومراحل الموقع المرسلة من المطورين لاعتماد مراحل المشروع.',
                'عقدة OCR المصنِّفة للمستندات والتي تقود التعرف على نوع الملف.'
            ]);
            setText(slide10, '.badge.green', 'نسبة أتمتة النظام 80%');
        }

        const slide11 = document.querySelector('#slide-11');
        if (slide11) {
            setHTML(slide11, '.slide-title', '<i class="fa-solid fa-eye"></i> 2. الرؤية الحاسوبية وسلامة الوسائط');
            setList(slide11, '.card.glass h3', ['كشف التلاعب بالصور', 'تقييم جودة الصورة', 'كشف الإعلانات المتشابهة (إزالة التكرار)']);
            setList(slide11, '.card.glass p', [
                'يكشف التلاعب الرقمي أو التجميل أو الفلاتر المضافة على صور العقار لضمان عرض صادق للحالة الحقيقية مثل الشقوق أو التسريبات.',
                'يرتب الوسائط المرفوعة بحسب الدقة والإضاءة والتركيز، ويمنح الصور الاحترافية عالية الجودة ترتيباً أعلى في البحث.',
                'يستخدم FAISS لفهرسة البصمات البصرية ومنع إعادة رفع الصور المسروقة بأسعار متضاربة.'
            ]);
        }

        const slide12 = document.querySelector('#slide-12');
        if (slide12) {
            setHTML(slide12, '.slide-title', '<i class="fa-solid fa-user-shield"></i> 3. الأمن والموثوقية ومكافحة الاحتيال');
            setList(slide12, '.content-side h3', ['التحقق من Face ID', 'كشف العقار المزيف', 'كشف الاحتيال في الدفع', 'كشف السلوك الشاذ']);
            setList(slide12, '.content-side p', [
                'يُطابق صور الوجه الحية مع سجلات الهوية الوطنية أثناء التسجيل لمنع سرقة الهوية بالكامل.',
                'يقارن اتجاهات الأسعار بمتوسطات السجل الجغرافي للإبلاغ عن الإعلانات الشاذة قبل أن تضر الباحثين.',
                'يراقب مسارات الدفع لاكتشاف زيادات اشتراك مشبوهة أو سحب بيانات البطاقات أو محاولات استنساخ البطاقات.',
                'يتعرف على محاولات الـ scraping والروبوتات واختراق الحسابات فوراً.'
            ]);
        }

        const slide13 = document.querySelector('#slide-13');
        if (slide13) {
            setHTML(slide13, '.slide-title', '<i class="fa-solid fa-tags"></i> 4. تحليلات السوق والتسعير الذكي');
            setText(slide13, '.slide-description', 'محركات تقييم آلية وخوارزميات سلاسل زمنية تمكّن الملاك والمشترين والشركات من اتخاذ قرارات أدق.');
            setList(slide13, '.card.glass h3', [
                'كشف شذوذ الأسعار', 'محرك اقتراح الأسعار', 'تنبؤات الأسعار',
                'تحليل اتجاهات السوق', 'توقع الطلب', 'توقع الإشغال والعائد'
            ]);
            setList(slide13, '.card.glass p', [
                'يلتقط الاستثناءات السعرية الحادة لحماية المشتري المبتدئ من التضخيم الخبيث أو الإعلانات الطُعم.',
                'يقترح أسعاراً تنافسية مثالية استناداً إلى المبيعات التاريخية المحلية لتقليل زمن الإغلاق.',
                'يتنبأ بالقفزات السعرية والاتجاهات التضخمية عبر نماذج الانحدار التاريخية.',
                'يستخرج التحولات الكلية وتقلصات العرض وأنماط الإيجار عبر المناطق الديموغرافية باستمرار.',
                'يتنبأ بمستويات الطلب على القطاعات السكنية والتجارية والإدارية لتوجيه خطط التطوير.',
                'يحسب الإشغال المستقبلي والعائد على الاستثمار للمستثمرين ومديري المحافظ العقارية.'
            ]);
        }

        const slide14 = document.querySelector('#slide-14');
        if (slide14) {
            setHTML(slide14, '.slide-title', '<i class="fa-solid fa-file-signature"></i> 5. التقييم المالي ومخاطر الائتمان');
            setText(slide14, 'h3', 'كيف نضمن موثوقية تأجير المستأجرين وتغطية الأقساط؟');
            setList(slide14, '.styled-list li strong', [
                'تقييم مخاطر الأقساط:',
                'تقييم أهلية الإيجار:',
                'النواة القرارية:',
                'مُعالج اقتراح الباند:'
            ]);
            setList(slide14, '.styled-list li', [
                '• يقيّم احتمال تعثر المشتري بناءً على حدود الدين إلى الدخل ومؤشرات الائتمان، لحماية المطورين من الاضطراب المالي.',
                '• يقيس نسب الملاءة المالية للمستأجر للتنبؤ باستمرارية السداد وتقليل الاحتكاك القانوني.',
                '• مُقيِّم مركزي يجمع المدخلات المالية في نموذج قبول/رفض موحّد.',
                '• يقترح مستويات الأسعار وخطط السداد الأكثر أماناً والمتوافقة مع الميزانية الفعلية للمتقدم.'
            ]);
            setText(slide14, '.risk-status.red', 'ملف مخاطر متوسط');
        }

        const slide15 = document.querySelector('#slide-15');
        if (slide15) {
            setHTML(slide15, '.slide-title', '<i class="fa-solid fa-file-contract"></i> 6. العقود الذكية والمشورة على الصفقات');
            setList(slide15, '.card.glass h3', ['رصد مخاطر العقد', 'اقتراح البنود', 'تحسين العرض المقابل']);
            setList(slide15, '.card.glass p', [
                'يفحص النصوص القانونية داخل المسودات لاكتشاف البنود غير المتوازنة والرسوم المخفية أو المصطلحات الإشكالية.',
                'ينصح بإضافة البنود الوقائية المهمة مثل غرامات التأخير أو حدود الصيانة وفق نوع الأصل.',
                'يحلل اتجاهات الإغلاق في الأحياء الصغيرة لاقتراح تسويات عادلة ومتوازنة أثناء التفاوض.'
            ]);
        }

        const slide16 = document.querySelector('#slide-16');
        if (slide16) {
            setHTML(slide16, '.slide-title', '<i class="fa-solid fa-magnifying-glass-chart"></i> 7. البحث الدلالي وحلقات التوصية الشخصية');
            setText(slide16, '.slide-description', 'طبقات استرجاع عميقة تتجاوز المطابقة الحرفية للنص لفهم نية السياق الحقيقية.');
        }

        const slide17 = document.querySelector('#slide-17');
        if (slide17) {
            setHTML(slide17, '.slide-title', '<i class="fa-solid fa-comments"></i> 8. نواة NLP ووكيل السمسار الذكي');
            setText(slide17, '.card.glass h3', 'الوكيل الاستشاري الذكي المستقل (AI Agent)');
            setList(slide17, '.styled-list li strong', ['اقتراحات نصية:', 'اقتراح الردود التلقائية:', 'اكتشاف اللغة واللهجة:']);
            setList(slide17, '.styled-list li', [
                '• ينشئ أوصافاً تسويقية جذابة ومحسّنة لمحركات البحث للعقارات المنشورة تلقائياً.',
                '• يزوّد الملاك بردود سريعة وواعية للسياق للتعامل مع استفسارات الحجز المتكررة.',
                '• يحدّد الصيغ المحلية للغة ليطابق نبرة النموذج مع الخلفية الثقافية للعميل.'
            ]);
        }

        const slide18 = document.querySelector('#slide-18');
        if (slide18) {
            setHTML(slide18, '.slide-title', '<i class="fa-solid fa-user-xmark"></i> 9. أمان المحتوى والاعتدال ومصفاة الرسائل المزعجة');
            setText(slide18, '.slide-description', 'طبقات فحص آلية تنظف الأوصاف النصية وتحمي قنوات التواصل من الاستغلال.');
            setList(slide18, '.card.glass h3', ['الاعتدال', 'كشف الرسائل المزعجة', 'قياس السمية', 'تحليل المشاعر', 'الاقتراحات المحظورة']);
            setList(slide18, '.card.glass p', [
                'يفحص النصوص والرفع البصري فوراً لمنع الألفاظ المسيئة أو مخالفات السياسات أو الروابط الخارجية غير المصرح بها.',
                'يحجب الإرسالات المكررة عالية التكرار من الوسطاء الذين يحاولون التلاعب بوجود المنصة.',
                'يقيس نبرة العدوان أو الابتزاز أو الإساءات اللفظية في الدردشة اللحظية.',
                'يتتبع اتجاهات رضا المستخدمين أو استيائهم عبر مراجعات العقارات.',
                'يرفع حالات الجهات السيئة بشكل دائم للإدراج في القوائم السوداء الإدارية.'
            ]);
        }

        const slide19 = document.querySelector('#slide-19');
        if (slide19) {
            setHTML(slide19, '.slide-title', '<i class="fa-solid fa-headset"></i> 10. ذكاء الدعم وأتمتة توجيه التذاكر');
            setList(slide19, '.card.glass h3', ['أتمتة CRM ومسارات الدعم', 'دعم القرار وملخصات التفاعل']);
            setList(slide19, '.styled-list li strong', ['تصنيف التذاكر:', 'منطق الأولوية:', 'تحليل البلاغات الذكي:', 'ترتيب العروض:', 'ملخص سلوك المستخدم:']);
            setList(slide19, '.styled-list li', [
                '• يصنّف طلبات الدعم الواردة (مالية أو تقنية أو نزاعات امتثال) إلى قنوات الحل المناسبة تلقائياً.',
                '• يحدد الشكاوى القانونية عالية الخطورة ومشكلات الضمان ويصعّدها قبل الاستفسارات العادية.',
                '• يفسر سجلات النصوص المرتبطة بالعقارات المبلغ عنها لاستخراج أنماط الاحتيال البنيوي.',
                '• يرتب العروض المالية الواردة في لوحة المالك وفق تطابق السعر وموثوقية المشتري.',
                '• ينشئ ملخصاً موجزاً لتفاعلات المستخدم الأخيرة لتسريع الحل لدى موظفي الدعم.'
            ]);
        }

        const slide20 = document.querySelector('#slide-20');
        if (slide20) {
            setHTML(slide20, '.slide-title', '<i class="fa-solid fa-robot"></i> منطق تنفيذ الشات بوت الذكي');
            setText(slide20, '.card.glass h3', 'تحليل الاستعلام والاسترجاع الخلفي والتقييم');
            setText(slide20, '.card.glass p', 'يعمل الشات بوت كوكيل ذكي مستقل يطابق رغبات المستخدمين بشكل مستمر مع الإعلانات الجديدة:');
            setList(slide20, '.styled-list li strong', ['تحليل الاستعلام الدلالي:', 'المطابقة الخلفية:', 'محرك درجة التطابق:', 'مصفوفة التفاوض التلقائي:']);
            setList(slide20, '.styled-list li', [
                '• يحول طلبات المستخدم إلى تمثيلات متجهية عالية الأبعاد لفهم النية البنيوية بعيداً عن المطابقة بالكلمات المفتاحية.',
                '• ينفذ دورات تقييم مستمرة لمواءمة متطلبات العميل مع الإعلانات الجديدة فور نشرها.',
                '• يمنح كل ملف عقار درجة دقة مئوية مطلقة بناءً على الميزانية والمدخلات البنيوية.',
                '• يوجّه حلقات المزايدة داخل المحادثة ويقترح نطاقات السوق لإتمام المعاملة بنجاح.'
            ]);
            const score = slide20.querySelector('.score-card-preview');
            if (score) {
                const spans = score.querySelectorAll('span');
                if (spans[0]) spans[0].textContent = 'حساب التوافق الدلالي';
                if (spans[1]) spans[1].textContent = '94.8% تطابق';
            }
        }

        const slide21 = document.querySelector('#slide-21');
        if (slide21) {
            setHTML(slide21, '.slide-title', '<i class="fa-solid fa-comments"></i> بنية الشات بوت وخط أنابيب مزامنة البيانات');
            setText(slide21, '.card.glass h3', 'استراتيجية تكامل قواعد البيانات');
            setText(slide21, '.card.glass p', 'يتصل النظام الحواري مباشرةً بمثيل MongoDB المحلي الخاص بالإعلانات. وعند نشر مالكٍ لعقار وتمتّعه بالتحقق التلقائي:');
            setList(slide21, '.styled-list li strong', ['بروتوكولات المزامنة الفورية:', 'روابط التوجيه الذكي:', 'مسارات عرض الصور:']);
            setList(slide21, '.styled-list li', [
                '• يرسل الإعلان الجديد فوراً إلى فهرس متجهات البحث الخاص بالوكيل الذكي عبر تدفقات الأحداث.',
                '• يوجّه المستخدمين مباشرةً إلى المسار التفاعلي `/properties/:postId` عند الضغط على "عرض" في بطاقات التوصية.',
                '• يمكّن الواجهة من عرض الوسائط بوضوح مع معالجة الروابط الثابتة المطلقة بأمان.'
            ]);
            const chats = slide21.querySelectorAll('.msg');
            if (chats[0]) chats[0].innerHTML = 'مرحباً! أستطيع أن أجد لك شقة 3 غرف بسعر مناسب في التجمع الخامس. هل أبدأ البحث؟';
            if (chats[1]) chats[1].innerHTML = 'نعم من فضلك، ويفضل أن تكون على مسافة مشي من الجامعة الأمريكية (AUC).';
            if (chats[2]) chats[2].innerHTML = 'وجدت لك تطابقاً ممتازاً:<br><strong>شقة مميزة بالتجمع الخامس</strong><br>السعر: 3,500,000 جنيه <button class="chat-btn">عرض العقار</button>';
        }

        const slide22 = document.querySelector('#slide-22');
        if (slide22) {
            setHTML(slide22, '.slide-title', '<i class="fa-solid fa-shield-halved"></i> إطار أمني متكامل متعدد الطبقات');
            setText(slide22, '.slide-description', 'طبقة قوية جاهزة للإنتاج بُنيت من اليوم الأول لحماية بيانات المستخدم وبوابات الدفع.');
            setList(slide22, '.security-card h4', ['MFA / 2FA', 'Face ID (KYC)', 'التحقق من البطاقة', 'RBAC']);
            setList(slide22, '.security-card p', [
                'يحمي نقاط المصادقة عبر رموز OTP سريعة وآمنة على الهاتف.',
                'يتحقق من الحسابات بمطابقة صور المستخدم مع سجلات الهوية باستخدام DeepFace.',
                'يستخدم أنماط دفع مشفرة متوافقة مع PCI-DSS لمنع البطاقات المسروقة.',
                'يفرض حدود التفويض بدقة بين الباحثين والملاك والشركات والمسؤولين.'
            ]);
        }

        const slide23 = document.querySelector('#slide-23');
        if (slide23) {
            setHTML(slide23, '.slide-title', '<i class="fa-solid fa-key"></i> أ. المصادقة الثنائية والوصول الآمن (2FA)');
            setText(slide23, '.card.glass h3', 'حواجز حماية MFA');
            setText(slide23, '.card.glass p', 'تضمن ملكية الحساب الحقيقية وتمنع محاولات الحقن الخبيثة في سياقات المعاملات عالية المخاطر.');
            setList(slide23, '.styled-list li strong', ['رموز المرور لمرة واحدة (OTP):', 'أمان JWT:', 'حماية القوة الغاشمة:']);
            setList(slide23, '.styled-list li', [
                '• تولد رموز تحقق مشفرة محدودة زمنياً (5 دقائق) وتُرسل إلى الهاتف الموثق.',
                '• تؤمن واجهات API قصيرة العمر مع مفاتيح تجديد مشفرة.',
                '• تراقب معدلات الفشل وتجمّد الحسابات تلقائياً أثناء هجمات تخمين كلمات المرور.'
            ]);
            const otp = slide23.querySelector('.otp-badge');
            if (otp) otp.textContent = '5 8 2 1';
        }

        const slide24 = document.querySelector('#slide-24');
        if (slide24) {
            setHTML(slide24, '.slide-title', '<i class="fa-solid fa-camera"></i> ب. التحقق البيومتري من الهوية (Face ID وKYC)');
            setText(slide24, '.card.glass h3', 'التحقق البيومتري من المعلن');
            setText(slide24, '.card.glass p', 'يستفيد من هياكل الرؤية الحاسوبية للتحقق من هوية الفرد وإلغاء عمليات الاحتيال المجهولة.');
            setList(slide24, '.styled-list li strong', ['تنفيذ DeepFace:', 'استخراج الوثيقة الحكومية:', 'شارة التحقق:']);
            setList(slide24, '.styled-list li', [
                '• يستخدم قوالب VGG-Face لاستخراج معالم الوجه وحساب التشابه الكوني بأمان.',
                '• يحلل بطاقات الهوية الرسمية لتأكيد الأسماء وصلاحية النشاط القانوني.',
                '• يمنح الملفات الناجحة شارة خضراء لرفع الثقة لدى الباحثين الجدد.'
            ]);
        }

        const slide25 = document.querySelector('#slide-25');
        if (slide25) {
            setHTML(slide25, '.slide-title', '<i class="fa-solid fa-credit-card"></i> ج. تكامل بوابة الدفع والتحقق من البطاقات');
            setText(slide25, '.card.glass h3', 'تأمين الدفعات المسبقة ومسارات الضمان');
            setText(slide25, '.card.glass p', 'يربط أطر الدفع الأساسية ببوابات دفع مميزة لضمان الحماية لكل من الشركات العقارية والمستخدمين.');
            setList(slide25, '.styled-list li strong', ['التشفير من طرف إلى طرف:', 'تقييم المخاطر اللحظي:', 'الفوترة المالية الآلية:']);
            setList(slide25, '.styled-list li', [
                '• يضمن أن بيانات البطاقات تصبح مشفّرة بالكامل ومتوافقة بدقة مع PCI-DSS.',
                '• يستخدم مسار تعلم آلي متخصص لاكتشاف حلقات الدفع غير المعتادة والبطاقات المخترقة.',
                '• ينشئ إيصالات رقمية آمنة ويسجل حجوزات الضمان لحماية الدفعات من التعارضات.'
            ]);
        }

        const slide26 = document.querySelector('#slide-26');
        if (slide26) {
            setHTML(slide26, '.slide-title', '<i class="fa-solid fa-user-lock"></i> د. التحكم الصارم في الوصول المبني على الأدوار (RBAC)');
            setText(slide26, '.card.glass h3', 'فرض حدود الحماية');
            setText(slide26, '.card.glass p', 'طبقة تفويض حديدية مطبقة على الواجهة والخادم للحفاظ على عزل البيانات حسب الدور.');
            setList(slide26, '.styled-list li strong', ['المسؤول:', 'المالك:', 'الشركة:', 'الباحث/المشتري:']);
            setList(slide26, '.styled-list li', [
                '• يتحكم بالمنصة بالكامل، يدير إعدادات الضمان، يراجع المستندات القانونية، ويتابع المؤشرات.',
                '• يدير العقارات والعروض والاتفاقات الخاصة به.',
                '• يدير الحسابات الفرعية للمندوبين والمشروعات السكنية الكبيرة والإحصاءات المؤسسية.',
                '• يتصفح الإعلانات ويحفظ المفضلة الآمنة ويستخدم الشات بوت ويبدأ مسارات الحجز.'
            ]);
            setList(slide26, '.role-badge', ['وصول المسؤول', 'وصول المالك', 'وصول الباحث']);
        }

        const slide27 = document.querySelector('#slide-27');
        if (slide27) {
            setHTML(slide27, '.slide-title', '<i class="fa-solid fa-list-check"></i> أهم 12 ميزة برمجية أساسية غير قائمة على الذكاء الاصطناعي');
            setText(slide27, '.slide-description', 'تحت طبقات الذكاء توجد محركات برمجية متقدمة تدير العمليات الأساسية اليومية.');
            setList(slide27, 'h4', [
                '1. نظام الدردشة اللحظية',
                '2. إدارة العقود الإلكترونية',
                '3. نظام المزايدة والتفاوض',
                '4. محرك الإعلانات الأساسي',
                '5. هيكل تذاكر الدعم',
                '6. محرك الاشتراكات والدفع',
                '7. البحث متعدد المعايير المتقدم',
                '8. المفضلة والمجموعات المحفوظة',
                '9. إدارة المجمعات للشركات',
                '10. عارض العرض والطلب الجغرافي',
                '11. إدارة فريق المبيعات والوسطاء',
                '12. وحدة المراجعة اليدوية'
            ]);
            const ps27 = slide27.querySelectorAll('p');
            const texts27 = [
                'يمكّن المحادثة الفورية بين الملاك والباحثين مع حفظ السجلات بأمان داخل MongoDB.',
                'ينسق رفع المستندات وتغيّر الحالات والتوقيع الإلكتروني والأرشفة القانونية.',
                'حلقة تفاوض تفاعلية تسمح بإرسال العروض والمقترحات المضادة وسجلات القبول.',
                'يتعامل مع تعريفات العقارات المعقدة والمرافق وإحداثيات الموقع الدقيقة.',
                'يسمح بفتح الشكاوى وتتبع حالة التذاكر والوصول إلى قنوات النزاع.',
                'يتكامل مع Stripe وPaymob لإدارة الاشتراكات المميزة والمدفوعات.',
                'يحّصر الإعلانات حسب السعر والمساحة والتقسيمات والموقع الجغرافي.',
                'يحفظ العقارات في قوائم مخصصة عبر الجلسات بأمان.',
                'لوحات مخصصة لإدارة المخططات الكبرى والوحدات الفرعية للشركات.',
                'لوحات تحليلية لعرض الطلب الفعلي مقابل الإتاحة داخل المدن المستهدفة.',
                'إضافة الوسطاء وتوزيع الصلاحيات وإدارة الأصول البيعية بكفاءة.',
                'بوابة آمنة لمراجعة الملفات المعلّمة وحل التصعيدات يدوياً.'
            ];
            ps27.forEach((p, i) => { if (texts27[i]) p.textContent = texts27[i]; });
        }

        const slide28 = document.querySelector('#slide-28');
        if (slide28) {
            setHTML(slide28, '.slide-title', '<i class="fa-solid fa-diagram-project"></i> خط أنابيب دورة حياة المعاملة العقارية من البداية للنهاية');
            setText(slide28, '.slide-description', 'عرض متسلسل لرحلة المعاملة العقارية داخل معمارية AqarMind.');
            const steps = slide28.querySelectorAll('.card.glass');
            const titles28 = ['1. نشر الإعلان', '2. الطلب والحجز', '3. الفحص المالي', '4. تنفيذ العقد'];
            const bodies28 = [
                'يرفع المالك إحداثيات العقار وسجلات الملكية، ثم يفحص محرك الذكاء الاصطناعي الموزع بصمات الملفات واتساق النص لمنع الإعلانات الاحتيالية فوراً.',
                'يستخدم الباحث الوكيل الذكي لاختيار الوحدة المناسبة سياقيًا، ثم يدفع رسوم الحجز الآمن ويثبت حالة الإعلان.',
                'تفاوض حلقات المزايدة على خطط الدفع، بينما تحلل خوارزميات مخاطر الائتمان سجلات المتقدمين لحماية البائعين من التعثر.',
                'ينشئ النظام العقد تلقائياً ويفحصه لاكتشاف البنود غير المتوازنة قبل السماح بالتوقيع الرقمي من الطرفين.'
            ];
            steps.forEach((card, i) => {
                const h3 = card.querySelector('h3');
                const p = card.querySelector('p');
                if (h3) h3.innerHTML = `${h3.querySelector('i')?.outerHTML || ''} ${titles28[i]}`;
                if (p) p.textContent = bodies28[i];
            });
            const footer28 = slide28.querySelector('.card.glass:last-of-type p');
            if (footer28) footer28.innerHTML = 'تعمل هذه السلسلة بالكامل بفضل <strong>معمارية EDMMA</strong>؛ إذ تنتقل مدخلات المستخدم من واجهة React SPA إلى نواة .NET التي تنسق بأمان مهام Python AI الخلفية عبر Apache Kafka للحفاظ على الأداء وسلامة المعاملات.';
        }

        const slide29 = document.querySelector('#slide-29');
        if (slide29) {
            setHTML(slide29, '.slide-title', '<i class="fa-solid fa-sack-dollar"></i> استراتيجية الأعمال ومسارات تحقيق الدخل');
            const h4s29 = slide29.querySelectorAll('h4');
            const p29 = slide29.querySelectorAll('p');
            const t29 = [
                'الاشتراكات المؤسسية (B2B Premium)',
                'عمولات المعاملات',
                'مساحات الإعلانات الممولة للعقارات',
                'واجهة برمجة البيانات التحليلية المميزة'
            ];
            const b29 = [
                'نماذج اشتراك شهرية وسنوية للمطورين لفتح عروض تصميم المجمعات، وتوزيع الفرق، والتحليلات الجغرافية المستهدفة.',
                'عمولة تنافسية صغيرة على المبيعات والإيجارات الموثقة عبر مسار التوقيع الرقمي الآمن.',
                'تمكين الوسطاء من ترقية الإعلانات والحصول على مواقع أولوية أعلى داخل شبكات البحث والتوصية.',
                'تحقيق دخل من مؤشرات اتجاهات السوق والتوقعات المالية للمطورين عبر اشتراكات API آمنة.'
            ];
            h4s29.forEach((h4, i) => { if (t29[i]) h4.textContent = t29[i]; });
            p29.forEach((p, i) => { if (b29[i]) p.textContent = b29[i]; });
            const bottom = slide29.querySelectorAll('.grid-2 > div > div:last-child');
            const labels29 = ['شركات عقارية', 'ملاك وباحثون', 'مستثمرون ومحللون'];
            bottom.forEach((node, i) => { if (labels29[i]) node.textContent = labels29[i]; });
        }
    }

    const safe = (label, fn) => {
        try {
            fn();
        } catch (error) {
            console.error(`Failed to translate ${label}:`, error);
        }
    };

    function applyLanguage(lang) {
        const strings = languageStrings[lang] || languageStrings.en;
        currentLanguage = lang;
        localStorage.setItem(storageKeys.language, lang);

        document.body.setAttribute('data-lang', lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';

        presentationInfoTitle.textContent = strings.headerTitle;
        presentationInfoBadge.textContent = strings.badge;
        sidebarFooterText.textContent = strings.sidebarFooter;
        notesDrawerTitle.textContent = strings.notesTitle;
        titleSubtitle.textContent = strings.titleSlideSubtitle || strings.titleSubtitle;
        publicationBadge.textContent = strings.titleSlidePubBadge || strings.publicationBadge;
        publicationHeading.textContent = strings.publicationHeading;
        if (titleSlideSubtitle) {
            titleSlideSubtitle.textContent = strings.titleSlideSubtitle || strings.titleSubtitle;
        }
        if (titleSlidePubDoi && titleSlidePubDoiLink) {
            const doiHref = titleSlidePubDoiLink.getAttribute('href');
            titleSlidePubDoi.innerHTML = lang === 'en'
                ? `DOI: <a href="${doiHref}" target="_blank">10.36227/techrxiv.177069590.04655255/v1</a> | IEEE TechRxiv`
                : `DOI: <a href="${doiHref}" target="_blank">10.36227/techrxiv.177069590.04655255/v1</a> | منصة IEEE TechRxiv`;
        }
        titleSlideTeamLabels.forEach((node, index) => {
            node.textContent = strings.titleSlideTeamLabels?.[index] || node.textContent;
        });
        titleSlideTeamValues.forEach((node, index) => {
            node.textContent = strings.titleSlideTeamValues?.[index] || node.textContent;
        });
        projectTeamNames.forEach((node, index) => {
            node.textContent = strings.projectTeamNames?.[index] || node.textContent;
        });

        // Trigger translations for dynamic slides (30 to 37) natively based on language selection
        applyDynamicBodyCopy(lang);
        applyAiEcosystemMapCopy(lang);
        if (lang === 'ar') {
            applyArabicStaticCopy();
        }

        overviewCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const body = card.querySelector('p');
            if (strings.overviewCards?.[index]) {
                title.textContent = strings.overviewCards[index].title;
                body.textContent = strings.overviewCards[index].body;
            }
        });

        roleCards.forEach((card, index) => {
            const title = card.querySelector('h4');
            const items = card.querySelectorAll('li');
            if (strings.roleCards?.[index]) {
                title.innerHTML = `${title.querySelector('i')?.outerHTML || ''} ${strings.roleCards[index].title}`;
                items.forEach((item, itemIndex) => {
                    item.textContent = strings.roleCards[index].bullets[itemIndex] || item.textContent;
                });
            }
        });

        challengeCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const body = card.querySelector('p');
            if (strings.challengeCards?.[index]) {
                title.innerHTML = `<span class="num-highlight">${String(index + 1).padStart(2, '0')}</span> ${strings.challengeCards[index].title}`;
                body.textContent = strings.challengeCards[index].body;
            }
        });

        solutionCards.forEach((card, index) => {
            const title = card.querySelector('h3');
            const listItems = card.querySelectorAll('li');
            if (strings.solutionCards?.[index]) {
                title.innerHTML = `${title.querySelector('i')?.outerHTML || ''} ${strings.solutionCards[index].title}`;
                listItems.forEach((item, itemIndex) => {
                    item.textContent = strings.solutionCards[index].bullets[itemIndex] || item.textContent;
                });
            }
        });

        toggleSidebarBtn.title = strings.toggleSidebarTitle;
        menuToggleBtn.title = strings.menuToggleTitle;
        toggleThemeBtn.title = strings.themeTitle;
        toggleFullscreenBtn.title = strings.fullscreenTitle;
        toggleNotesBtn.title = strings.notesToggleTitle;
        closeNotesBtn.title = strings.closeNotesTitle;
        if (toggleLanguageBtn) {
            toggleLanguageBtn.title = strings.languageTitle;
            toggleLanguageBtn.innerHTML = `<span style="font-size:0.7rem;font-weight:800;letter-spacing:0.04em;">${strings.languageLabel}</span>`;
        }

        Array.from(menuItems).forEach((item, index) => {
            const name = item.querySelector('.slide-name');
            if (name) {
                name.textContent = lang === 'ar'
                    ? (strings.menuLabels[index] || originalMenuLabels[index])
                    : originalMenuLabels[index];
            }
        });
        orderedSlides.forEach((slide, displayIndex) => {

    const node = slide.querySelector('.slide-description');
    if (!node) return;

    const originalIndex = displayToOriginal[displayIndex];

    if (lang === 'ar') {
        node.textContent =
            strings.slideDescriptions?.[originalIndex] ||
            originalSlideDescriptions[originalIndex];
    } else {
        node.textContent =
            originalSlideDescriptions[originalIndex];
    }
});

        if (lang === 'ar') {
            slideDescriptionNodes.forEach((node, index) => {
                const translated = strings.slideDescriptions?.[index];
                if (translated !== undefined) {
                    node.textContent = translated;
                }
            });
        }

        if (lang === 'ar') {
            document.title = 'AqarMind - مناقشة مشروع التخرج';
        } else {
            document.title = 'AqarMind - Graduation Presentation';
        }

        if (currentSlide >= 0 && currentSlide < totalSlides) {
            loadSpeakerNotes(displayToOriginal[currentSlide]);
        }
    }

    function applyTheme(theme) {
        const resolvedTheme = theme === 'light' ? 'light' : 'dark';
        if (resolvedTheme === 'light') {
            document.body.setAttribute('data-theme', 'light');
            toggleThemeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        } else {
            document.body.removeAttribute('data-theme');
            toggleThemeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        }
        localStorage.setItem(storageKeys.theme, resolvedTheme);
    }

    // Initialize Presentation
    function init() {
        slideOrder.forEach(originalIndex => {
            menuList.appendChild(menuItems[originalIndex]);
        });
        slides.forEach(slide => slide.classList.remove('active', 'is-entering', 'is-exiting'));
        menuItems.forEach(item => item.classList.remove('active'));
        applyTheme(getInitialTheme());
        applyLanguage(getInitialLanguage());
        showSlide(getInitialSlide());
        updateProgress();
        setupEventListeners();
    }

    // Navigation Logic
    function showSlide(index) {
        if (index < 0 || index >= totalSlides || isTransitioning) return;

        const nextOriginalIndex = displayToOriginal[index];
        const previousSlide = currentSlide >= 0 ? orderedSlides[currentSlide] : null;
        const previousMenuItem = currentSlide >= 0 ? orderedMenuItems[currentSlide] : null;
        const nextSlide = orderedSlides[index];
        const nextMenuItem = orderedMenuItems[index];

        currentSlideDirection = currentSlide === -1 || index > currentSlide ? 'next' : 'prev';
        currentSlideVariant = slideVariants[index % slideVariants.length];
        document.body.dataset.slideDirection = currentSlideDirection;
        document.body.dataset.slideVariant = currentSlideVariant;

        window.clearTimeout(transitionTimer);
        isTransitioning = true;

        if (previousSlide) {
            previousSlide.classList.add('is-exiting');
            previousSlide.style.pointerEvents = 'none';
            window.setTimeout(() => {
                previousSlide.classList.remove('active', 'is-exiting');
                previousSlide.style.pointerEvents = '';
            }, 640);
        }
        if (previousMenuItem) {
            previousMenuItem.classList.remove('active');
        }

        currentSlide = index;
        localStorage.setItem(storageKeys.slide, String(index));

        nextSlide.classList.add('active', 'is-entering');
        nextMenuItem.classList.add('active');
        
        slideIndicator.textContent = `${currentSlide + 1} / ${totalSlides}`;
        
        updateProgress();
        
        loadSpeakerNotes(nextOriginalIndex);
        
const menuContainer = document.querySelector(".slide-menu");

if (menuContainer) {
    menuContainer.scrollTo({
        top: nextMenuItem.offsetTop - 100,
        behavior: "smooth"
    });
}
        triggerCustomSlideAnimations();

        transitionTimer = window.setTimeout(() => {
            nextSlide.classList.remove('is-entering');
            isTransitioning = false;
        }, 780);
    }

    function updateProgress() {
        const percentage = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    function loadSpeakerNotes(originalIndex) {
        if (currentLanguage === 'en' && speakerNotesEn[originalIndex]) {
            notesContent.textContent = speakerNotesEn[originalIndex];
        } else if (speakerNotesAr[originalIndex]) {
            notesContent.textContent = speakerNotesAr[originalIndex];
        } else {
            notesContent.textContent = currentLanguage === 'en'
                ? 'No speaker notes are available for this slide.'
                : 'لا توجد ملاحظات متوفرة لهذه الشريحة.';
        }
    }

    function getInitialLanguage() {
        const storedLanguage = localStorage.getItem(storageKeys.language);
        if (storedLanguage === 'en' || storedLanguage === 'ar') return storedLanguage;
        const match = window.location.hash.match(/lang=(en|ar)/);
        if (match) return match[1];
        return 'en';
    }

    function getInitialTheme() {
        return localStorage.getItem(storageKeys.theme) === 'light' ? 'light' : 'dark';
    }

    function getInitialSlide() {
        const storedSlide = Number(localStorage.getItem(storageKeys.slide));
        if (Number.isInteger(storedSlide) && storedSlide >= 0 && storedSlide < totalSlides) {
            return storedSlide;
        }
        return 0;
    }

    function triggerCustomSlideAnimations() {
        const needle = document.querySelector('.meter-needle');
        if (needle) {
            if (currentSlide === 15) {
                setTimeout(() => {
                    needle.style.transform = 'rotate(42deg)';
                }, 300);
            } else {
                needle.style.transform = 'rotate(-70deg)';
            }
        }
    }

    function toggleNotes() {
        notesDrawer.classList.toggle('active');
        toggleNotesBtn.classList.toggle('active');
    }

    function toggleSidebar() {
        sidebar.classList.toggle('collapsed');
        if (sidebar.classList.contains('collapsed')) {
            document.querySelector('.main-content').style.marginRight = '0';
        } else {
            if (window.innerWidth > 1024) {
                document.querySelector('.main-content').style.marginRight = '0';
            }
        }
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            toggleFullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
        } else {
            document.exitFullscreen();
            toggleFullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    }

    function setupEventListeners() {
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

        menuItems.forEach((item, originalIndex) => {
            const displayIndex = originalToDisplay.get(originalIndex);
            item.setAttribute('data-slide', displayIndex);
            const num = item.querySelector('.slide-num');
            if (num) {
                num.textContent = String(displayIndex + 1).padStart(2, '0');
            }

            item.addEventListener('click', () => {
                const targetSlide = parseInt(item.getAttribute('data-slide'));
                showSlide(targetSlide);
            });
        });

        const catCards = document.querySelectorAll('.ai-cat-card');
        catCards.forEach(card => {
            card.addEventListener('click', () => {
           const catMap = {
    'doc': 12,
    'vision': 13,
    'security': 14,
    'pricing': 15,
    'finance': 16,
    'contracts': 17,
    'search': 18,
    'nlp': 19,
    'moderation': 20,
    'support': 21
};

catCards.forEach(card => {
    card.addEventListener('click', () => {
        const cat = card.getAttribute('data-cat');

        if (catMap[cat] !== undefined) {
            showSlide(catMap[cat]);
        }
    });
});

card.addEventListener('click', () => {
    const cat = card.dataset.cat;
    if (catMap[cat] !== undefined) {
        showSlide(catMap[cat]);
    }
});
            });
        });

        toggleNotesBtn.addEventListener('click', toggleNotes);
        closeNotesBtn.addEventListener('click', toggleNotes);
        toggleSidebarBtn.addEventListener('click', toggleSidebar);
        menuToggleBtn.addEventListener('click', toggleSidebar);

        toggleThemeBtn.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            applyTheme(currentTheme === 'light' ? 'dark' : 'light');
        });

        if (toggleLanguageBtn) {
            toggleLanguageBtn.addEventListener('click', () => {
                const nextLanguage = currentLanguage === 'en' ? 'ar' : 'en';
                applyLanguage(nextLanguage);
            });
        }

        toggleFullscreenBtn.addEventListener('click', toggleFullscreen);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                showSlide(currentSlide + 1);
            } else if (e.key === 'ArrowRight') {
                showSlide(currentSlide - 1);
            } else if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                showSlide(currentSlide + 1);
            } else if (e.key === 'PageDown') {
                showSlide(currentSlide + 1);
            } else if (e.key === 'PageUp') {
                showSlide(currentSlide - 1);
            } else if (e.key === 'n' || e.key === 'N') {
                toggleNotes();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
        });
    }

    
    // Run Initialization
    init();
});
