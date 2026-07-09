// Presentation State
let currentSlideIndex = 1;
const totalSlides = 13;

// Interactive Avatar State
const avatarState = {
    banho: false,
    barba: false,
    uniforme: false,
    toucaMascara: false,
    balaclava: false
};

// Checklist State
const checklistState = [false, false, false, false];

// Quiz Data
const quizQuestions = [
    {
        question: "Qual a temperatura ideal de saída da massa de pães congelados da masseira para evitar fermentação precoce?",
        options: [
            "Entre 15°C e 20°C",
            "Entre 5°C e 8°C",
            "Acima de 25°C"
        ],
        answer: 1,
        feedback: "Correto! Manter a massa fria (entre 5°C e 8°C) é crucial para que o fermento não seja ativado antes do tempo, garantindo o poder de crescimento do pão após o descongelamento."
    },
    {
        question: "Com base no infográfico da IMAC, qual foi a redução no tempo de limpeza após a otimização dos processos?",
        options: [
            "Redução de 49% (economizando 40min por dia)",
            "Redução de 10% (economizando 5min por dia)",
            "Redução de 75% (economizando 2 horas por dia)"
        ],
        answer: 0,
        feedback: "Excelente! As melhorias organizacionais reduziram o tempo de limpeza em 49%, caindo de 1h22min para apenas 42min diários."
    },
    {
        question: "Qual dos 'S' do programa 5S orienta a descartar ou separar o que não é útil na área produtiva?",
        options: [
            "Seiso (Limpeza)",
            "Seiton (Organização)",
            "Seiri (Utilização/Descarte)"
        ],
        answer: 2,
        feedback: "Correto! O Seiri trata do senso de Utilização, eliminando tudo que não agrega valor no posto de trabalho para abrir espaço e otimizar processos."
    }
];

let currentQuestionIndex = 0;
let quizScore = 0;

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    updateSlideDisplay();
    
    // Add slide footers dynamically for Slide 2 to 12
    document.querySelectorAll('.slide').forEach((slide, index) => {
        const slideNum = index + 1;
        if (slideNum > 1 && slideNum < 13) {
            const footer = document.createElement('div');
            footer.className = 'slide-footer';
            footer.innerHTML = `
                <span>🛡️ CONTROLE DE QUALIDADE</span>
                <span>Slide ${slideNum} de 13</span>
            `;
            slide.appendChild(footer);
        }
    });
});

// Slide Navigation
function updateSlideDisplay() {
    // Hide all slides and set relative classes for sliding transitions
    document.querySelectorAll('.slide').forEach((slide, index) => {
        const slideNum = index + 1;
        slide.classList.remove('active', 'prev');
        if (slideNum < currentSlideIndex) {
            slide.classList.add('prev');
        } else if (slideNum === currentSlideIndex) {
            slide.classList.add('active');
        }
    });

    // Progress Bar
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const percentage = (currentSlideIndex / totalSlides) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.innerText = `Slide ${currentSlideIndex} de ${totalSlides}`;

    // Buttons
    document.getElementById('btnPrev').disabled = currentSlideIndex === 1;
    
    const nextBtn = document.getElementById('btnNext');
    if (currentSlideIndex === totalSlides) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'flex';
        nextBtn.innerText = currentSlideIndex === 1 ? 'Começar' : 'Próximo';
    }
}

function nextSlide() {
    if (currentSlideIndex === 2) {
        const allCompleted = avatarState.banho && avatarState.barba && avatarState.uniforme && avatarState.toucaMascara && avatarState.balaclava;
        if (!allCompleted) {
            const errorMsg = document.getElementById('higiene-error-msg');
            if (errorMsg) {
                errorMsg.innerText = "❌ Higiene pessoal inadequada! Colaborador não pode adentrar na produção.";
                errorMsg.style.display = "block";
            }
            return;
        } else {
            const errorMsg = document.getElementById('higiene-error-msg');
            if (errorMsg) errorMsg.style.display = "none";
        }
    }
    if (currentSlideIndex < totalSlides) {
        currentSlideIndex++;
        updateSlideDisplay();
    }
}

function prevSlide() {
    if (currentSlideIndex > 1) {
        currentSlideIndex--;
        updateSlideDisplay();
    }
}

// Slide 2: Higiene Pessoal Simulator
function toggleHigiene(type) {
    // Enforce sequential steps
    if (!avatarState[type]) {
        if (type === 'barba' && !avatarState.banho) {
            alert("⚠️ Passo 1 obrigatório: Realize o Banho Diário primeiro!");
            return;
        }
        if (type === 'uniforme' && !avatarState.barba) {
            alert("⚠️ Passo 2 obrigatório: Faça a barba antes de vestir o uniforme!");
            return;
        }
        if (type === 'toucaMascara' && !avatarState.uniforme) {
            alert("⚠️ Passo 3 obrigatório: Vista o uniforme limpo antes de colocar a touca e a máscara!");
            return;
        }
        if (type === 'balaclava' && !avatarState.toucaMascara) {
            alert("⚠️ Passo 4 obrigatório: Coloque a touca e a máscara antes da balaclava!");
            return;
        }
        avatarState[type] = true;
    } else {
        // Turning off: Turn off this and all subsequent steps
        avatarState[type] = false;
        if (type === 'banho') {
            avatarState.barba = false;
            avatarState.uniforme = false;
            avatarState.toucaMascara = false;
            avatarState.balaclava = false;
        } else if (type === 'barba') {
            avatarState.uniforme = false;
            avatarState.toucaMascara = false;
            avatarState.balaclava = false;
        } else if (type === 'uniforme') {
            avatarState.toucaMascara = false;
            avatarState.balaclava = false;
        } else if (type === 'toucaMascara') {
            avatarState.balaclava = false;
        }
    }
    
    // Update card active classes
    const cardTypes = ['banho', 'barba', 'uniforme', 'toucaMascara', 'balaclava'];
    cardTypes.forEach(t => {
        const card = document.getElementById(`card-${t}`);
        if (card) {
            if (avatarState[t]) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        }
    });

    // Update avatar SVG graphics
    const body = document.getElementById('avatar-body');
    const pants = document.getElementById('avatar-pants');
    const sleeveL = document.getElementById('avatar-sleeve-l');
    const sleeveR = document.getElementById('avatar-sleeve-r');
    const bootL = document.getElementById('avatar-boot-l');
    const bootR = document.getElementById('avatar-boot-r');
    
    const dirt = document.getElementById('avatar-dirt');
    const hair = document.getElementById('avatar-hair');
    const sideburns = document.getElementById('avatar-sideburns');
    const earL = document.getElementById('avatar-ear-l');
    const earR = document.getElementById('avatar-ear-r');
    const beard = document.getElementById('avatar-beard');
    const cap = document.getElementById('avatar-cap');
    const balaclava = document.getElementById('avatar-balaclava');
    const mask = document.getElementById('avatar-mask');
    const maskStrapL = document.getElementById('avatar-mask-strap-l');
    const maskStrapR = document.getElementById('avatar-mask-strap-r');
    
    // 1. Banho Diário
    if (dirt) dirt.style.opacity = avatarState.banho ? '0' : '1';
    
    // 2. Barba Feita
    if (beard) beard.style.opacity = avatarState.barba ? '0' : '1';
    if (sideburns) sideburns.style.opacity = avatarState.barba ? '0' : '1';
    
    // 3. Vestir a Farda (Turn uniform white)
    if (avatarState.uniforme) {
        if(body) { body.setAttribute('fill', '#ffffff'); body.setAttribute('stroke', '#cbd5e1'); }
        if(pants) { pants.setAttribute('fill', '#ffffff'); pants.setAttribute('stroke', '#cbd5e1'); }
        if(sleeveL) sleeveL.setAttribute('stroke', '#ffffff');
        if(sleeveR) sleeveR.setAttribute('stroke', '#ffffff');
        if(bootL) { bootL.setAttribute('fill', '#ffffff'); bootL.setAttribute('stroke', '#cbd5e1'); }
        if(bootR) { bootR.setAttribute('fill', '#ffffff'); bootR.setAttribute('stroke', '#cbd5e1'); }
    } else {
        if(body) { body.setAttribute('fill', '#3b82f6'); body.setAttribute('stroke', '#1d4ed8'); }
        if(pants) { pants.setAttribute('fill', '#334155'); pants.setAttribute('stroke', '#1e293b'); }
        if(sleeveL) sleeveL.setAttribute('stroke', '#3b82f6');
        if(sleeveR) sleeveR.setAttribute('stroke', '#3b82f6');
        if(bootL) { bootL.setAttribute('fill', '#475569'); bootL.removeAttribute('stroke'); }
        if(bootR) { bootR.setAttribute('fill', '#475569'); bootR.removeAttribute('stroke'); }
    }

    // 4. Touca & Máscara
    if (avatarState.toucaMascara) {
        if(cap) cap.style.opacity = '1';
        if(mask) mask.style.opacity = '1';
        if(maskStrapL) maskStrapL.style.opacity = '1';
        if(maskStrapR) maskStrapR.style.opacity = '1';
        if(hair) hair.style.opacity = '0';
        if(earL) earL.style.opacity = '0';
        if(earR) earR.style.opacity = '0';
    } else {
        if(cap) cap.style.opacity = '0';
        if(mask) mask.style.opacity = '0';
        if(maskStrapL) maskStrapL.style.opacity = '0';
        if(maskStrapR) maskStrapR.style.opacity = '0';
        if(hair) hair.style.opacity = '1';
        // Only restore ears if balaclava is not covering them
        if (!avatarState.balaclava) {
            if(earL) earL.style.opacity = '1';
            if(earR) earR.style.opacity = '1';
        }
    }

    // 5. Capuz Balaclava (Covers head, ears, and layered on top of touca/mask)
    if (avatarState.balaclava) {
        if(balaclava) {
            balaclava.style.opacity = '1';
            balaclava.style.transform = 'scale(1.02)';
        }
        if(earL) earL.style.opacity = '0';
        if(earR) earR.style.opacity = '0';
    } else {
        if(balaclava) {
            balaclava.style.opacity = '0';
            balaclava.style.transform = 'scale(1)';
        }
        if (!avatarState.toucaMascara) {
            if(earL) earL.style.opacity = '1';
            if(earR) earR.style.opacity = '1';
        }
    }

    // Update feedback message
    const feedback = document.getElementById('avatar-feedback');
    if (avatarState.banho && avatarState.barba && avatarState.uniforme && avatarState.toucaMascara && avatarState.balaclava) {
        feedback.innerText = "✨ Colaborador 100% em Conformidade! Pronto para entrar na área limpa.";
        feedback.style.color = "var(--color-success)";
        // Clear block message if visible
        const errorMsg = document.getElementById('higiene-error-msg');
        if (errorMsg) errorMsg.style.display = "none";
    } else {
        let missing = [];
        if (!avatarState.banho) missing.push("1. Banho Diário");
        if (!avatarState.barba) missing.push("2. Barba Feita");
        if (!avatarState.uniforme) missing.push("3. Vestir a Farda");
        if (!avatarState.toucaMascara) missing.push("4. Touca & Máscara");
        if (!avatarState.balaclava) missing.push("5. Uso da balaclava correta");
        feedback.innerText = `Falta validar: ${missing.join(', ')}`;
        feedback.style.color = "var(--color-danger)";
    }
}

// Slide 3: 5S Tabs
const sData = [
    {
        title: "Seiri - Senso de Utilização",
        desc: "Separar o que é necessário para a produção do que não é. Utensílios quebrados, ingredientes fora do padrão ou ferramentas avulsas devem ser retirados da área produtiva de pão congelado imediatamente. Isso evita riscos de contaminação e acidentes com os operadores."
    },
    {
        title: "Seiton - Senso de Organização",
        desc: "Um lugar para cada coisa e cada coisa no seu lugar. As formas de pão, carrinhos transportadores de assadeira, termômetros de massa e espátulas devem ter locais específicos demarcados. A organização agiliza o processo de congelamento e evita que a massa perca o ponto esperando por ferramentas."
    },
    {
        title: "Seiso - Senso de Limpeza",
        desc: "Limpar o ambiente constantemente e, mais importante, não sujar. A limpeza preventiva na masseira, modeladoras e divisoras deve ser feita com sanitizantes aprovados. O infográfico mostra que com a definição de equipes e o sistema 'Produzir e Limpar', otimizamos a rotina diária."
    },
    {
        title: "Seiketsu & Shitsuke - Padronização e Autodisciplina",
        desc: "Seiketsu é manter os 3 sensos anteriores padronizados visualmente. Shitsuke é transformar as boas práticas em hábito diário de cada colaborador, onde todos se comprometem com a qualidade e higiene do pão congelado de forma autônoma."
    }
];

function showS(index) {
    // Update active tab styling
    const tabs = document.querySelectorAll('.s-tab');
    tabs.forEach((tab, idx) => {
        if (idx === index - 1) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update Content
    const data = sData[index - 1];
    const container = document.getElementById('s-content-box');
    container.innerHTML = `
        <div class="s-tab-detail">
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
        </div>
    `;
}

// Fullscreen Infographic Modal
function openFullscreenImg() {
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('imgModalTarget');
    modalImg.src = "Infográfico de Melhoria.png";
    modal.style.display = "flex";
}

function closeFullscreenImg() {
    const modal = document.getElementById('imgModal');
    modal.style.display = "none";
}

// Slide 4: Massa Simulator (Removed)
function updateMassaSim() {}

// Slide 5: Quality Checklist
function toggleChecklist(index) {
    checklistState[index] = !checklistState[index];
    
    const items = document.querySelectorAll('.checklist-item');
    if (checklistState[index]) {
        items[index].classList.add('checked');
    } else {
        items[index].classList.remove('checked');
    }

    // Calculate completion percentage
    const completedCount = checklistState.filter(Boolean).length;
    const progressPercent = (completedCount / checklistState.length) * 100;

    // Update gauge
    const gaugeCircle = document.getElementById('gauge-circle');
    const gaugeValue = document.getElementById('gauge-value');
    gaugeValue.innerText = `${progressPercent}%`;
    gaugeCircle.style.background = `conic-gradient(var(--color-accent) ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%)`;

    // Enable/Disable validation button
    const validateBtn = document.getElementById('checklist-btn');
    if (completedCount === checklistState.length) {
        validateBtn.disabled = false;
        validateBtn.innerText = "Liberar Lote!";
        validateBtn.style.background = "var(--color-success)";
        validateBtn.style.color = "white";
    } else {
        validateBtn.disabled = true;
        validateBtn.innerText = "Aguardando Inspeção";
        validateBtn.style.background = "var(--color-accent)";
        validateBtn.style.color = "var(--color-primary-dark)";
    }
}

function validateLote() {
    alert("🎉 Lote de pães congelados aprovado e liberado para expedição! Todos os controles de BPF foram seguidos.");
}

// Slide 6: Product Quality (Freeze Bread)
let isBreadFrozen = false;
function toggleFreezeBread() {
    isBreadFrozen = !isBreadFrozen;
    const crystals = document.getElementById('pao-cristais');
    const tempBadge = document.getElementById('pao-temp-badge');
    const pao = document.querySelector('.pao-desenho');

    if (isBreadFrozen) {
        crystals.classList.add('congelado');
        pao.style.background = "#b4d3e8"; // Ice blue-ish brown
        pao.style.boxShadow = "0 10px 25px rgba(59, 130, 246, 0.3)";
        tempBadge.innerText = "Pão Ultracongelado: -18°C ou menor ❄️";
        tempBadge.style.background = "#2563eb";
    } else {
        crystals.classList.remove('congelado');
        pao.style.background = "#d4a373"; // Original bread brown
        pao.style.boxShadow = "0 10px 25px rgba(92, 61, 46, 0.2)";
        tempBadge.innerText = "Pão em Temperatura Ambiente";
        tempBadge.style.background = "var(--color-primary)";
    }
}

// Slide 7: Quiz Logic
function initQuiz() {
    currentQuestionIndex = 0;
    quizScore = 0;
    showQuizQuestion();
}

function showQuizQuestion() {
    const qData = quizQuestions[currentQuestionIndex];
    document.getElementById('quiz-question-num').innerText = `Pergunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
    document.getElementById('quiz-score').innerText = `Pontos: ${quizScore}`;
    document.getElementById('quiz-question-text').innerText = qData.question;
    document.getElementById('quiz-feedback').innerText = "";

    const optionsContainer = document.getElementById('quiz-options-container');
    optionsContainer.innerHTML = "";

    qData.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = "quiz-option";
        btn.innerText = opt;
        btn.onclick = () => selectQuizAnswer(idx);
        optionsContainer.appendChild(btn);
    });
}

function selectQuizAnswer(selectedIdx) {
    const qData = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');
    
    // Disable all options
    options.forEach((optBtn, idx) => {
        optBtn.disabled = true;
        if (idx === qData.answer) {
            optBtn.classList.add('correct');
        } else if (idx === selectedIdx) {
            optBtn.classList.add('wrong');
        }
    });

    const feedback = document.getElementById('quiz-feedback');
    if (selectedIdx === qData.answer) {
        quizScore += 10;
        feedback.innerText = "Resposta Correta! " + qData.feedback;
        feedback.style.color = "var(--color-success)";
    } else {
        feedback.innerText = "Resposta Incorreta. " + qData.feedback;
        feedback.style.color = "var(--color-danger)";
    }

    document.getElementById('quiz-score').innerText = `Pontos: ${quizScore}`;

    // Move to next question after delay
    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            showQuizQuestion();
        } else {
            // End of Quiz
            const container = document.getElementById('quiz-options-container');
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <h3>Quiz Concluído!</h3>
                    <p style="font-size: 1.2rem; margin: 1rem 0;">Você fez ${quizScore} de ${quizQuestions.length * 10} pontos.</p>
                    <button class="btn btn-primary" style="margin: 0 auto;" onclick="resetQuiz()">Tentar Novamente</button>
                </div>
            `;
            document.getElementById('quiz-question-text').innerText = "Excelente progresso!";
            document.getElementById('quiz-feedback').innerText = "";
        }
    }, 4500);
}

function resetQuiz() {
    initQuiz();
}

// Slide 8: Certificate Generation
function generateCertificate() {
    const nameInput = document.getElementById('worker-name').value.trim();
    if (!nameInput) {
        alert("Por favor, digite seu nome completo.");
        return;
    }

    // Set Date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    document.getElementById('cert-date').innerText = `${day}/${month}/${year}`;

    // Set Name
    document.getElementById('cert-printed-name').innerText = nameInput.toUpperCase();

    // Toggle panels
    document.getElementById('cert-input-panel').style.display = 'none';
    document.getElementById('cert-frame').style.display = 'block';
}

// Fullscreen Slide View
function toggleFullscreen() {
    const container = document.getElementById('presentationContainer');
    if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
            container.classList.add('fullscreen-mode');
        }).catch(err => {
            // Fallback
            container.classList.toggle('fullscreen-mode');
        });
    } else {
        document.exitFullscreen();
    }
}

// Listen to fullscreen exit to clean up classes
document.addEventListener('fullscreenchange', () => {
    const container = document.getElementById('presentationContainer');
    if (!document.fullscreenElement) {
        container.classList.remove('fullscreen-mode');
    }
});

// Open Fullscreen Image Modal with dynamic source
function openFullscreenImgSrc(src) {
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('imgModalTarget');
    modalImg.src = src;
    modal.style.display = "flex";
}

// Keyboard navigation (Standard for slides)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Spacebar' || e.key === ' ') {
        // Prevent default spacebar scrolling
        if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            nextSlide();
        }
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
});

