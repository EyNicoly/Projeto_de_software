import React, { useEffect, useState, useCallback } from 'react';
import '../styles/TrainerBody.css'; // O CSS será adaptado para este arquivo

// Dados das perguntas (copiado de script.js)
const questions = [
    {
        id: 'objetivo',
        question: 'Qual é o seu principal objetivo de treino?',
        type: 'radio',
        options: [
            { value: 'hipertrofia', text: 'Ganho de massa muscular (Hipertrofia)' },
            { value: 'emagrecimento', text: 'Perda de peso (Emagrecimento)' },
            { value: 'resistencia', text: 'Melhora da resistência e condicionamento físico' },
            { value: 'forca', text: 'Aumento de força' },
            { value: 'manutencao', text: 'Manutenção da forma física e bem-estar geral' }
        ]
    },
    {
        id: 'experiencia',
        question: 'Qual o seu nível atual de experiência com treinos de força?',
        type: 'radio',
        options: [
            { value: 'iniciante', text: 'Iniciante (Nunca treinei ou treinei por menos de 3 meses)' },
            { value: 'intermediario', text: 'Intermediário (Treino há 3-12 meses, conheço os exercícios básicos e a técnica)' },
            { value: 'avancado', text: 'Avançado (Treino há mais de 1 ano, tenho boa técnica, intensidade e consigo periodizar)' }
        ]
    },
    {
        id: 'frequencia',
        question: 'Quantos dias por semana você se compromete a treinar (Segunda a Sexta)?',
        type: 'radio',
        options: [
            { value: '3', text: '3 dias por semana' },
            { value: '4', text: '4 dias por semana' },
            { value: '5', text: '5 dias por semana' }
        ]
    },
    {
        id: 'restricoes',
        question: 'Você possui alguma restrição física, lesão ou condição de saúde que devemos considerar?',
        type: 'radio',
        options: [
            { value: 'sim', text: 'Sim (especificarei mais tarde, se necessário)' },
            { value: 'nao', text: 'Não, estou apto(a) para qualquer tipo de treino' }
        ]
    },
    {
        id: 'local',
        question: 'Onde você prefere realizar seus treinos?',
        type: 'radio',
        options: [
            { value: 'casa', text: 'Em casa (com pouco ou nenhum equipamento)' },
            { value: 'academia', text: 'Na academia (com acesso a uma variedade de equipamentos)' }
        ]
    },
    {
        id: 'tempo',
        question: 'Quanto tempo você tem disponível para cada sessão de treino (incluindo aquecimento e desaquecimento)?',
        type: 'radio',
        options: [
            { value: '30-45', text: '30-45 minutos' },
            { value: '45-60', text: '45-60 minutos' },
            { value: '60+', text: 'Mais de 60 minutos' }
        ]
    },
    {
        id: 'preferencia_cardio',
        question: 'Você gostaria de incluir sessões de cardio no seu treino?',
        type: 'radio',
        options: [
            { value: 'sim', text: 'Sim, em dias separados ou após o treino de força' },
            { value: 'nao', text: 'Não, foco apenas no treino de força' }
        ]
    }
];

// Base de dados de exercícios (copiado de script.js)
const exerciseDatabase = {
    academia: {
        peito: [
            { nome: 'Supino Reto com Barra', series: '3-4', reps: '8-12', obs: 'Foque na técnica e controle do movimento.' },
            { nome: 'Supino Inclinado com Halteres', series: '3', reps: '8-12', obs: 'Trabalha a parte superior do peito. Mantenha o controle.' },
            { nome: 'Crucifixo com Halteres', series: '3', reps: '10-15', obs: 'Movimento de isolamento. Estenda bem o peito.' },
            { nome: 'Crossover no Cabo', series: '3', reps: '12-15', obs: 'Contração máxima no final do movimento.' }
        ],
        costas: [
            { nome: 'Puxada Frontal na Máquina', series: '3-4', reps: '8-12', obs: 'Mantenha o peito estufado e contraia as escápulas.' },
            { nome: 'Remada Curvada com Barra', series: '3', reps: '8-12', obs: 'Mantenha a coluna reta e puxe em direção ao umbigo.' },
            { nome: 'Remada Baixa no Cabo', series: '3', reps: '10-15', obs: 'Foque na contração das costas e não nos braços.' },
            { nome: 'Pulldown com Braço Estendido', series: '3', reps: '12-15', obs: 'Isolamento do grande dorsal.' }
        ],
        pernas: [
            { nome: 'Agachamento Livre com Barra', series: '3-4', reps: '8-12', obs: 'Desça até 90 graus ou mais, mantendo a postura.' },
            { nome: 'Leg Press 45º', series: '3', reps: '10-15', obs: 'Amplitude completa, sem tirar o quadril do banco.' },
            { nome: 'Extensão de Pernas na Máquina', series: '3', reps: '12-15', obs: 'Contração máxima no topo do movimento.' },
            { nome: 'Mesa Flexora', series: '3', reps: '12-15', obs: 'Foque na parte posterior da coxa. Movimento controlado.' },
            { nome: 'Panturrilha em Pé', series: '4', reps: '15-20', obs: 'Amplitude total, alongando e contraindo bem.' }
        ],
        ombros: [
            { nome: 'Desenvolvimento com Halteres Sentado', series: '3', reps: '8-12', obs: 'Controle o peso na subida e descida.' },
            { nome: 'Elevação Lateral com Halteres', series: '3', reps: '12-15', obs: 'Mantenha os cotovelos levemente flexionados e eleve até a altura dos ombros.' },
            { nome: 'Elevação Frontal com Halteres', series: '3', reps: '12-15', obs: 'Alternado ou simultâneo. Foco na porção anterior do ombro.' },
            { nome: 'Remada Alta com Barra', series: '3', reps: '10-12', obs: 'Puxe a barra até o queixo, cotovelos para cima.' }
        ],
        bracos: [
            { nome: 'Rosca Direta com Barra', series: '3', reps: '10-12', obs: 'Bíceps - movimento controlado, sem balançar o tronco.' },
            { nome: 'Rosca Alternada com Halteres', series: '3', reps: '10-12', obs: 'Bíceps - alterne os braços, mantendo a postura.' },
            { nome: 'Tríceps Testa com Barra EZ', series: '3', reps: '10-12', obs: 'Tríceps - cuidado com os cotovelos, estenda bem.' },
            { nome: 'Tríceps Pulley com Corda', series: '3', reps: '12-15', obs: 'Tríceps - extensão completa, contraindo no final.' }
        ],
        abs_lombar: [
            { nome: 'Prancha Abdominal', series: '3', reps: '30-60s', obs: 'Mantenha o corpo reto e contraia o abdômen.' },
            { nome: 'Abdominal Remador', series: '3', reps: '15-20', obs: 'Suba o tronco e as pernas simultaneamente.' },
            { nome: 'Elevação de Pernas', series: '3', reps: '15-20', obs: 'Deitado, eleve as pernas sem tirar a lombar do chão.' },
            { nome: 'Hiperextensão Lombar', series: '3', reps: '12-15', obs: 'Fortalece a região lombar. Movimento controlado.' }
        ],
        cardio: [
            { nome: 'Esteira (Corrida/Caminhada)', series: '30-45 min', reps: 'N/A', obs: 'Intensidade moderada a alta.' },
            { nome: 'Elíptico', series: '30-45 min', reps: 'N/A', obs: 'Bom para baixo impacto.' },
            { nome: 'Bicicleta Ergométrica', series: '30-45 min', reps: 'N/A', obs: 'Varie a intensidade.' }
        ]
    },
    casa: {
        corpo_todo: [
            { nome: 'Flexão de Braço', series: '3', reps: '8-15', obs: 'Adapte a dificuldade (joelhos no chão, inclinado).' },
            { nome: 'Agachamento Livre', series: '3', reps: '15-20', obs: 'Mantenha o peso nos calcanhares e a coluna reta.' },
            { nome: 'Prancha Abdominal', series: '3', reps: '30-60s', obs: 'Mantenha o corpo alinhado e contraia o abdômen.' },
            { nome: 'Afundo Alternado', series: '3', reps: '10-12/perna', obs: 'Mantenha o equilíbrio e desça o joelho de trás próximo ao chão.' }
        ],
        superior: [
            { nome: 'Flexão Tradicional', series: '3', reps: '8-15', obs: 'Peito, ombros e tríceps. Mantenha o core ativado.' },
            { nome: 'Flexão Diamante', series: '3', reps: '5-10', obs: 'Foco no tríceps. Mãos próximas formando um diamante.' },
            { nome: 'Pike Push-up', series: '3', reps: '8-12', obs: 'Trabalha os ombros. Corpo em formato de V invertido.' },
            { nome: 'Remada Invertida (com mesa/cadeira)', series: '3', reps: '10-15', obs: 'Costas e bíceps. Quanto mais horizontal, mais difícil.' }
        ],
        inferior: [
            { nome: 'Agachamento Sumô', series: '3', reps: '15-20', obs: 'Pés afastados, pontas para fora. Foco nos glúteos e parte interna da coxa.' },
            { nome: 'Afundo Búlgaro (com cadeira)', series: '3', reps: '10-12/perna', obs: 'Equilíbrio e força unilateral. Cuidado com a postura.' },
            { nome: 'Elevação de Quadril (Glute Bridge)', series: '3', reps: '15-20', obs: 'Contraia bem os glúteos no topo do movimento.' },
            { nome: 'Panturrilha em Pé', series: '4', reps: '20-30', obs: 'Pode usar um degrau para maior amplitude.' }
        ],
        abs_lombar: [
            { nome: 'Prancha Abdominal', series: '3', reps: '30-60s', obs: 'Mantenha o corpo reto e contraia o abdômen.' },
            { nome: 'Crunch', series: '3', reps: '15-20', obs: 'Foco na contração do abdômen superior.' },
            { nome: 'Abdominal Bicicleta', series: '3', reps: '15-20/lado', obs: 'Trabalha oblíquos. Toque cotovelo no joelho oposto.' },
            { nome: 'Superman', series: '3', reps: '12-15', obs: 'Fortalece a lombar. Eleve braços e pernas simultaneamente.' }
        ],
        cardio: [
            { nome: 'Polichinelos', series: '3', reps: '45-60s', obs: 'Aquecimento e cardio. Movimento contínuo.' },
            { nome: 'Corrida Estacionária (High Knees)', series: '3', reps: '45-60s', obs: 'Eleve bem os joelhos. Acelere o ritmo.' },
            { nome: 'Burpees', series: '3', reps: '8-12', obs: 'Exercício completo e intenso. Faça com boa forma.' },
            { nome: 'Mountain Climbers', series: '3', reps: '30-45s', obs: 'Mantenha o core ativado e o ritmo constante.' }
        ]
    }
};

// Mapeamento de dias da semana para grupos musculares (exemplo)
const workoutSplit = {
    '3': ['pernas', 'peito', 'costas'], // 3 dias: Pernas, Peito/Ombro/Tríceps, Costas/Bíceps
    '4': ['pernas', 'peito', 'costas', 'ombros'], // 4 dias: PPLU (Pernas, Push, Pull, Upper)
    '5': ['pernas', 'peito', 'costas', 'ombros', 'bracos'] // 5 dias: PPLUL (Pernas, Push, Pull, Upper, Lower)
};

// Funções utilitárias
const getDayKey = (date) => date.toISOString().split('T')[0];

// Componente para renderizar o calendário
const Calendar = ({ currentDate, trainedDays, setTrainedDays }) => {
    const [date, setDate] = useState(currentDate);
    const month = date.getMonth();
    const year = date.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Dom, 1 = Seg
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Dias do mês anterior
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    // Dias do mês atual
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, isCurrentMonth: true });
    }
    // Dias do próximo mês
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let i = 1; i <= remainingDays; i++) {
        days.push({ day: i, isCurrentMonth: false });
    }

    const handlePrevMonth = () => setDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setDate(new Date(year, month + 1, 1));

    return (
        <div className="calendar-section">
            <div className="calendar-header">
                <h3 id="calendar-month-year">{date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
                <div className="calendar-nav">
                    <button onClick={handlePrevMonth} title="Mês anterior">
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button onClick={handleNextMonth} title="Próximo mês">
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            
            <div className="calendar-grid">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}
                {days.map((day, index) => {
                    const dayDate = new Date(year, month, day.day);
                    const dayKey = getDayKey(dayDate);
                    const isToday = day.isCurrentMonth && dayDate.toDateString() === currentDate.toDateString();
                    const isTrained = trainedDays.includes(dayKey);

                    return (
                        <div 
                            key={index} 
                            className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isTrained ? 'trained' : ''}`}
                        >
                            {day.day}
                        </div>
                    );
                })}
            </div>
            
            <div className="calendar-legend">
                <div className="legend-item">
                    <div className="legend-color today"></div>
                    <span>Hoje</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color trained"></div>
                    <span>Treinou</span>
                </div>
            </div>
        </div>
    );
};

// Componente para renderizar uma pergunta
const Question = ({ questionData, answer, setAnswer }) => {
    return (
        <div className="question-card">
            <h4>{questionData.question}</h4>
            <div className="options-group">
                {questionData.options.map(option => (
                    <label key={option.value} className="option-label">
                        <input
                            type={questionData.type}
                            name={questionData.id}
                            value={option.value}
                            checked={answer === option.value}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                        <span>{option.text}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

// Componente principal
const TrainerBody = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(JSON.parse(localStorage.getItem('userAnswers') || '{}'));
    const [currentWorkout, setCurrentWorkout] = useState(JSON.parse(localStorage.getItem('currentWorkout') || 'null'));
    const [trainedDays, setTrainedDays] = useState(JSON.parse(localStorage.getItem('trainedDays') || '[]'));
    const [imcResult, setImcResult] = useState(JSON.parse(localStorage.getItem('imcResult') || 'null'));
    const [imcData, setImcData] = useState({ peso: '', altura: '' });
    const currentDate = new Date();

    // Salvar respostas no localStorage
    useEffect(() => {
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    }, [userAnswers]);

    // Salvar treino no localStorage
    useEffect(() => {
        localStorage.setItem('currentWorkout', JSON.stringify(currentWorkout));
    }, [currentWorkout]);

    // Salvar dias treinados no localStorage
    useEffect(() => {
        localStorage.setItem('trainedDays', JSON.stringify(trainedDays));
    }, [trainedDays]);

    // Salvar IMC no localStorage
    useEffect(() => {
        localStorage.setItem('imcResult', JSON.stringify(imcResult));
    }, [imcResult]);

    // Navegação entre seções
    const showSection = useCallback((sectionId) => {
        setActiveSection(sectionId);
        if (sectionId === 'questionnaire') {
            setCurrentQuestionIndex(0);
        }
    }, []);

    // Lógica do Questionário
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleAnswerChange = (value) => {
        setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
    };

    const handleNext = () => {
        if (!userAnswers[currentQuestion.id]) {
            alert('Por favor, selecione uma opção antes de continuar.');
            return;
        }
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            generateWorkout();
            showSection('workout');
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    // Lógica de Geração de Treino (Adaptada de script.js)
    const generateWorkout = () => {
        const { local, frequencia } = userAnswers;
        if (!local || !frequencia) return;

        const splitKey = frequencia;
        const split = workoutSplit[splitKey];
        const db = exerciseDatabase[local];

        if (!split || !db) {
            setCurrentWorkout({ error: 'Não foi possível gerar o treino com as respostas fornecidas.' });
            return;
        }

        const newWorkout = {
            meta: {
                local: local === 'academia' ? 'Academia' : 'Em Casa',
                frequencia: `${frequencia} dias por semana`,
                objetivo: questions.find(q => q.id === 'objetivo').options.find(o => o.value === userAnswers.objetivo)?.text || 'Não especificado'
            },
            schedule: {}
        };

        const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
        
        // Distribui os treinos pelos dias da semana
        for (let i = 0; i < split.length; i++) {
            const day = daysOfWeek[i];
            const muscleGroup = split[i];
            newWorkout.schedule[day] = {
                day: day,
                muscleGroup: muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1),
                exercises: db[muscleGroup] || []
            };
        }
        
        // Adiciona cardio se for o caso
        if (userAnswers.preferencia_cardio === 'sim') {
            const cardioDayIndex = split.length;
            if (cardioDayIndex < 5) { // Adiciona cardio no próximo dia útil (até sexta)
                const cardioDay = daysOfWeek[cardioDayIndex];
                newWorkout.schedule[cardioDay] = {
                    day: cardioDay,
                    muscleGroup: 'Cardio',
                    exercises: db.cardio || []
                };
            }
        }

        setCurrentWorkout(newWorkout);
    };

    // Lógica do Treino de Hoje (Adaptada de script.js)
    const loadTodayWorkout = useCallback(() => {
        if (!currentWorkout) return {
            title: 'Nenhum Treino Gerado',
            content: (
                <div className="no-exercises">
                    <p>Complete o questionário para gerar seu plano de treino personalizado!</p>
                    <button className="btn btn-primary" onClick={() => showSection('questionnaire')}>
                        <i className="fas fa-clipboard-list"></i>
                        Fazer Questionário
                    </button>
                </div>
            )
        };

        const today = currentDate.getDay(); // 0 (Dom) a 6 (Sáb)
        const dayMap = { 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta' };
        const dayName = dayMap[today];

        if (currentWorkout.schedule[dayName] && currentWorkout.schedule[dayName].exercises.length > 0) {
            const workout = currentWorkout.schedule[dayName];
            return {
                title: `Treino de Hoje: ${workout.muscleGroup}`,
                content: (
                    <div className="today-exercises">
                        {workout.exercises.map((ex, index) => (
                            <div key={index} className="today-exercise">
                                <div className="exercise-name">{ex.nome}</div>
                                <div className="exercise-details">{ex.series} Séries x {ex.reps} Repetições</div>
                                <div className="exercise-obs">{ex.obs}</div>
                            </div>
                        ))}
                    </div>
                )
            };
        } else {
             return {
                title: 'Dia de Descanso',
                content: (
                    <div className="no-exercises">
                        <p>Hoje é dia de descanso ou não há treino agendado para {dayName}.</p>
                        <p>Aproveite para se recuperar e se preparar para o próximo treino!</p>
                    </div>
                )
            };
        }
    }, [currentWorkout, currentDate, showSection]);
    
    const todayWorkout = loadTodayWorkout();

    // Lógica de Marcar Treino Concluído
    const markTodayAsCompleted = () => {
        const todayKey = getDayKey(currentDate);
        if (!trainedDays.includes(todayKey)) {
            setTrainedDays(prev => [...prev, todayKey]);
            alert('Treino de hoje marcado como concluído!');
        } else {
            alert('Você já marcou o treino de hoje como concluído.');
        }
    };

    // Lógica da Calculadora de IMC (Adaptada de script.js)
    const calculateIMC = (e) => {
        e.preventDefault();
        const peso = parseFloat(imcData.peso);
        const altura = parseFloat(imcData.altura);

        if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
            setImcResult({ error: 'Por favor, insira valores válidos para peso e altura.' });
            return;
        }

        const imcValue = peso / (altura * altura);
        let classification = '';

        if (imcValue < 18.5) {
            classification = 'Abaixo do peso';
        } else if (imcValue >= 18.5 && imcValue < 24.9) {
            classification = 'Peso normal';
        } else if (imcValue >= 25 && imcValue < 29.9) {
            classification = 'Sobrepeso';
        } else if (imcValue >= 30 && imcValue < 34.9) {
            classification = 'Obesidade Grau I';
        } else if (imcValue >= 35 && imcValue < 39.9) {
            classification = 'Obesidade Grau II (Severa)';
        } else {
            classification = 'Obesidade Grau III (Mórbida)';
        }

        setImcResult({ imc: imcValue.toFixed(2), classification });
    };
    
    // Renderização do Questionário
    const renderQuestionnaire = () => (
        <>
            <div className="progress-container">
                <div className="progress-header">
                    <h3>Questionário de Personalização</h3>
                    <p>Responda algumas perguntas para criarmos o treino perfeito para você</p>
                </div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="progress-text">Pergunta {currentQuestionIndex + 1} de {questions.length}</p>
            </div>
            <section id="questions-section" className="questions-section">
                <div className="question-container">
                    <Question 
                        questionData={currentQuestion} 
                        answer={userAnswers[currentQuestion.id] || ''} 
                        setAnswer={handleAnswerChange} 
                    />
                </div>
                
                <div className="navigation-buttons">
                    <button 
                        id="prev-btn" 
                        className="btn btn-secondary" 
                        onClick={handlePrev} 
                        style={{ display: currentQuestionIndex === 0 ? 'none' : 'flex' }}
                    >
                        <i className="fas fa-arrow-left"></i>
                        Anterior
                    </button>
                    <button 
                        id="next-btn" 
                        className="btn btn-primary" 
                        onClick={handleNext}
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finalizar e Gerar Treino' : 'Próximo'}
                        <i className="fas fa-arrow-right"></i>
                    </button>
                </div>

                <div className="tips-section">
                    <div className="tip-card">
                        <i className="fas fa-lightbulb"></i>
                        <div className="tip-content">
                            <h4>Dica Profissional</h4>
                            <p>Seja honesto(a) nas suas respostas para obter o melhor treino possível para seus objetivos.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

    // Renderização da Tela de Treino
    const renderWorkout = () => (
        <section id="workout-section" className="workout-section">
            <div className="workout-container">
                <div className="workout-header-section">
                    <i className="fas fa-trophy"></i>
                    <h2>Seu Treino Está Pronto!</h2>
                    <p>Baseado nas suas respostas, criamos um plano de treino personalizado e otimizado para seus objetivos.</p>
                    <div className="workout-meta">
                        <p><strong>Objetivo:</strong> {currentWorkout.meta.objetivo}</p>
                        <p><strong>Local:</strong> {currentWorkout.meta.local}</p>
                        <p><strong>Frequência:</strong> {currentWorkout.meta.frequencia}</p>
                    </div>
                </div>
                
                <div id="workout-result" className="workout-result">
                    {Object.values(currentWorkout.schedule).map(dayWorkout => (
                        <div key={dayWorkout.day} className="day-workout-card">
                            <h3>{dayWorkout.day} - {dayWorkout.muscleGroup}</h3>
                            <div className="day-exercises">
                                {dayWorkout.exercises.map((ex, index) => (
                                    <div key={index} className="exercise-item">
                                        <div className="exercise-name">{ex.nome}</div>
                                        <div className="exercise-details">{ex.series} Séries x {ex.reps} Repetições</div>
                                        <div className="exercise-obs">{ex.obs}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="workout-actions">
                    <button className="btn btn-primary" onClick={() => showSection('home')}>
                        <i className="fas fa-home"></i>
                        Voltar ao Início
                    </button>
                    <button className="btn btn-secondary" onClick={() => showSection('questionnaire')}>
                        <i className="fas fa-redo"></i>
                        Refazer Questionário
                    </button>
                    {/* A função exportWorkout não será implementada aqui, apenas o botão */}
                    <button className="btn btn-secondary" disabled>
                        <i className="fas fa-download"></i>
                        Exportar PDF (Não implementado)
                    </button>
                </div>
            </div>
        </section>
    );
    
    // Renderização da Calculadora IMC
    const renderIMC = () => (
        <section id="imc-section" className="imc-section">
            <div className="imc-container">
                <div className="imc-header">
                    <i className="fas fa-calculator"></i>
                    <h2>Calculadora de IMC</h2>
                    <p>Calcule seu Índice de Massa Corporal e descubra sua classificação</p>
                </div>
                
                <div className="imc-calculator">
                    <form className="imc-form" onSubmit={calculateIMC}>
                        <div className="input-group">
                            <label htmlFor="peso">Peso (kg)</label>
                            <input
                                type="number"
                                id="peso"
                                placeholder="Ex: 75.5"
                                step="0.1"
                                value={imcData.peso}
                                onChange={(e) => setImcData(prev => ({ ...prev, peso: e.target.value }))}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="altura">Altura (m)</label>
                            <input
                                type="number"
                                id="altura"
                                placeholder="Ex: 1.75"
                                step="0.01"
                                value={imcData.altura}
                                onChange={(e) => setImcData(prev => ({ ...prev, altura: e.target.value }))}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Calcular IMC</button>
                    </form>

                    {imcResult && (
                        <div className="imc-result-card">
                            {imcResult.error ? (
                                <p className="error-message">{imcResult.error}</p>
                            ) : (
                                <>
                                    <h3>Resultado do IMC:</h3>
                                    <p className="imc-value">{imcResult.imc}</p>
                                    <p className="imc-classification">Classificação: <strong>{imcResult.classification}</strong></p>
                                    <p className="imc-tip">Lembre-se: O IMC é apenas um indicador. Consulte um profissional de saúde para uma avaliação completa.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );

    // Renderização da Tela Inicial (Home)
    const renderHome = () => (
        <section id="home-section" className="home-section">
            <div className="home-header">
                <h2>Bem-vindo ao seu Dashboard de Treino</h2>
                <p>Acompanhe seu progresso e veja seu treino de hoje</p>
            </div>
            
            <div className="home-content">
                <div className="workout-today">
                    <h3>{todayWorkout.title}</h3>
                    <div id="today-workout-content">
                        {todayWorkout.content}
                    </div>
                </div>
                
                <div className="sidebar">
                    <Calendar 
                        currentDate={currentDate} 
                        trainedDays={trainedDays} 
                        setTrainedDays={setTrainedDays} 
                    />
                    
                    <div className="quick-actions">
                        <h3>Ações Rápidas</h3>
                        <div className="action-buttons">
                            <button className="action-btn" onClick={() => showSection('questionnaire')}>
                                <i className="fas fa-clipboard-list"></i>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Refazer Questionário</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Atualizar preferências</div>
                                </div>
                            </button>
                            <button className="action-btn" onClick={() => showSection('imc')}>
                                <i className="fas fa-calculator"></i>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Calcular IMC</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Verificar índice corporal</div>
                                </div>
                            </button>
                            <button className="action-btn" onClick={markTodayAsCompleted}>
                                <i className="fas fa-check-circle"></i>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Marcar Treino Concluído</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Registrar treino de hoje</div>
                                </div>
                            </button>
                            {/* A função exportWorkout não será implementada aqui, apenas o botão */}
                            <button className="action-btn" disabled>
                                <i className="fas fa-download"></i>
                                <div>
                                    <div style={{ fontWeight: 600 }}>Exportar Treino</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Salvar como PDF (Não implementado)</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    // Renderização principal do componente
    return (
        <div className="container">
            <header className="header">
                <div className="logo">
                    <i className="fas fa-dumbbell"></i>
                    <h1>TrainerBody</h1>
                </div>
                <p className="subtitle">Seu treino personalizado e inteligente em poucos cliques</p>
                
                <div className="nav-menu">
                    <button 
                        className={`nav-btn ${activeSection === 'home' ? 'active' : ''}`} 
                        onClick={() => showSection('home')}
                    >
                        <i className="fas fa-home"></i>
                        Início
                    </button>
                    <button 
                        className={`nav-btn ${activeSection === 'imc' ? 'active' : ''}`} 
                        onClick={() => showSection('imc')}
                    >
                        <i className="fas fa-calculator"></i>
                        Calculadora IMC
                    </button>
                </div>
            </header>

            <div className="main-content">
                {activeSection === 'home' && renderHome()}
                {activeSection === 'imc' && renderIMC()}
                {activeSection === 'questionnaire' && renderQuestionnaire()}
                {activeSection === 'workout' && renderWorkout()}
            </div>
        </div>
    );
};

export default TrainerBody;
