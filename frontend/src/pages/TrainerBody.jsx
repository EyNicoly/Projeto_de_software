import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TrainerBody.css';

// Dados das perguntas
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
        id: 'tempo',
        question: 'Quanto tempo você tem disponível para cada sessão de treino (incluindo aquecimento e desaquecimento)?',
        type: 'radio',
        options: [
            { value: '30-45', text: '30-45 minutos' },
            { value: '45-60', text: '45-60 minutos' },
            { value: '60+', text: 'Mais de 60 minutos' }
        ]
    },
];

// Base de dados de exercícios
const exerciseDatabase = {
    academia: {
        peito: [
            {
                nome: 'Supino Reto com Barra',
                series: '3-4',
                reps: '8-12',
                obs: 'Foque na técnica e controle do movimento.',
                substituto_casa: 'Flexão de braço (3x 8-15 repetições)'
            },
            {
                nome: 'Supino Inclinado com Halteres',
                series: '3',
                reps: '8-12',
                obs: 'Trabalha a parte superior do peito.',
                substituto_casa: 'Flexão inclinada com apoio (3x 10-15 reps)'
            },
            {
                nome: 'Crucifixo com Halteres',
                series: '3',
                reps: '10-15',
                obs: 'Movimento de isolamento.',
                substituto_casa: 'Abertura com elástico ou toalha (3x 12-15 reps)'
            }
        ],
        costas: [
            {
                nome: 'Puxada Frontal na Máquina',
                series: '3-4',
                reps: '8-12',
                obs: 'Contraia as escápulas.',
                substituto_casa: 'Remada inclinada usando mochila com peso (3x 12 reps)'
            },
            {
                nome: 'Remada Curvada com Barra',
                series: '3',
                reps: '8-12',
                obs: 'Coluna reta.',
                substituto_casa: 'Remada com mochila ou galão de água (3x 10-12 reps)'
            },
            {
                nome: 'Pulldown com Braço Estendido',
                series: '3',
                reps: '12-15',
                obs: 'Isolamento.',
                substituto_casa: 'Pullover com elástico/toalha (3x 12-15 reps)'
            }
        ],
        pernas: [
            {
                nome: 'Agachamento Livre com Barra',
                series: '3-4',
                reps: '8-12',
                obs: 'Postura sempre correta.',
                substituto_casa: 'Agachamento livre (3x 15-20 reps)'
            },
            {
                nome: 'Leg Press 45º',
                series: '3',
                reps: '10-15',
                obs: 'Amplitude completa.',
                substituto_casa: 'Agachamento sumô (3x 15-20 reps)'
            },
            {
                nome: 'Mesa Flexora',
                series: '3',
                reps: '12-15',
                obs: 'Posterior da coxa.',
                substituto_casa: 'Good morning com mochila leve (3x 12-15 reps)'
            }
        ],
        ombros: [
            {
                nome: 'Desenvolvimento com Halteres Sentado',
                series: '3',
                reps: '8-12',
                obs: 'Subida controlada.',
                substituto_casa: 'Pike push up (3x 8-12 reps)'
            },
            {
                nome: 'Elevação Lateral com Halteres',
                series: '3',
                reps: '12-15',
                obs: 'Cotovelo levemente flexionado.',
                substituto_casa: 'Elevação lateral com garrafas de água (3x 12-15 reps)'
            }
        ],
        bracos: [
            {
                nome: 'Rosca Direta com Barra',
                series: '3',
                reps: '10-12',
                obs: 'Nada de balançar o tronco.',
                substituto_casa: 'Rosca com mochila ou garrafas (3x 12 reps)'
            },
            {
                nome: 'Tríceps Pulley com Corda',
                series: '3',
                reps: '12-15',
                obs: 'Contração total.',
                substituto_casa: 'Tríceps banco (3x 12-15 reps)'
            }
        ],
        abs_lombar: [
            {
                nome: 'Prancha Abdominal',
                series: '3',
                reps: '30-60s',
                obs: 'Corpo reto.',
                substituto_casa: null
            },
            {
                nome: 'Hiperextensão Lombar',
                series: '3',
                reps: '12-15',
                obs: 'Movimento controlado.',
                substituto_casa: 'Superman (3x 12-15 reps)'
            }
        ]
    }
};

const workoutSplit = {
    '3': ['pernas', 'peito', 'costas'],
    '4': ['pernas', 'peito', 'costas', 'ombros'],
    '5': ['pernas', 'peito', 'costas', 'ombros', 'bracos']
};

const getDayKey = (date) => date.toISOString().split('T')[0];

// Componente Calendário
const Calendar = ({ currentDate, trainedDays }) => {
    const [date, setDate] = useState(currentDate);
    const month = date.getMonth();
    const year = date.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push({ day: i, isCurrentMonth: true });
    }
    const remainingDays = 42 - days.length;
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

// Componente de Pergunta
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
    const navigate = useNavigate();
    
    // Verificar autenticação
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    const getInitialSection = () => {
        const savedSection = localStorage.getItem('activeSection');
        const hasWorkout = localStorage.getItem('currentWorkout');
        
        if (savedSection === 'workout' && !hasWorkout) {
            return 'home';
        }
        
        return savedSection || 'home';
    };

    const [activeSection, setActiveSection] = useState(getInitialSection());
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(JSON.parse(localStorage.getItem('userAnswers') || '{}'));
    const [currentWorkout, setCurrentWorkout] = useState(JSON.parse(localStorage.getItem('currentWorkout') || 'null'));
    const [trainedDays, setTrainedDays] = useState(JSON.parse(localStorage.getItem('trainedDays') || '[]'));
    const [imcResult, setImcResult] = useState(JSON.parse(localStorage.getItem('imcResult') || 'null'));
    const [imcData, setImcData] = useState({ peso: '', altura: '' });
    const currentDate = new Date();

    useEffect(() => {
        localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    }, [userAnswers]);

    useEffect(() => {
        localStorage.setItem('currentWorkout', JSON.stringify(currentWorkout));
    }, [currentWorkout]);

    useEffect(() => {
        localStorage.setItem('trainedDays', JSON.stringify(trainedDays));
    }, [trainedDays]);

    useEffect(() => {
        localStorage.setItem('imcResult', JSON.stringify(imcResult));
    }, [imcResult]);

    useEffect(() => {
        localStorage.setItem('activeSection', activeSection);
    }, [activeSection]);

    const showSection = useCallback((sectionId) => {
        setActiveSection(sectionId);
        if (sectionId === 'questionnaire') {
            setCurrentQuestionIndex(0);
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm('Deseja realmente sair?')) {
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    // 🔥 NOVA FUNÇÃO: Navegar para o perfil do usuário
    const handleGoToProfile = () => {
        navigate('/profile');
    };

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

    const generateWorkout = () => {
        const local = 'academia';
        const frequencia = userAnswers.frequencia;

        if (!frequencia) {
            alert('Selecione a frequência de treino para gerar o plano.');
            return;
        }

        const split = workoutSplit[frequencia];
        const db = exerciseDatabase[local];

        if (!split || !db) {
            setCurrentWorkout({ error: 'Não foi possível gerar o treino com as respostas fornecidas.' });
            return;
        }

        const objetivoText = questions
            .find(q => q.id === 'objetivo')
            ?.options.find(o => o.value === userAnswers.objetivo)?.text || 'Não especificado';

        const newWorkout = {
            meta: {
                local: 'Academia',
                frequencia: `${frequencia} dias por semana`,
                objetivo: objetivoText
            },
            schedule: {}
        };

        const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

        for (let i = 0; i < split.length; i++) {
            const day = daysOfWeek[i];
            const muscleGroup = split[i];
            newWorkout.schedule[day] = {
                day,
                muscleGroup: muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1),
                exercises: db[muscleGroup] ? [...db[muscleGroup]] : []
            };
        }

        setCurrentWorkout(newWorkout);
    };

    const loadTodayWorkout = useCallback(() => {
        if (!currentWorkout) {
            return {
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
        }

        const today = currentDate.getDay();
        const dayMap = { 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta' };
        const dayName = dayMap[today];

        if (!dayName) {
            return {
                title: 'Fim de Semana',
                content: (
                    <div className="no-exercises">
                        <p>Hoje é fim de semana — sem treino agendado.</p>
                    </div>
                )
            };
        }

        const todaySchedule = currentWorkout.schedule?.[dayName];

        if (todaySchedule && (todaySchedule.exercises?.length || 0) > 0) {
            const workout = todaySchedule;
            return {
                title: `Treino de Hoje: ${workout.muscleGroup}`,
                content: (
                    <div className="today-exercises">
                        { (workout.exercises || []).map((ex, index) => (
                            <div key={index} className="today-exercise">
                                <div className="exercise-name">{ex.nome}</div>
                                <div className="exercise-details">{ex.series} Séries x {ex.reps} Repetições</div>
                                <div className="exercise-obs">{ex.obs}</div>
                                {ex.substituto_casa && (
                                    <div className="exercise-substitute">Substituto em casa: {ex.substituto_casa}</div>
                                )}
                            </div>
                        )) }
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

    const markTodayAsCompleted = () => {
        const todayKey = getDayKey(currentDate);
        if (!trainedDays.includes(todayKey)) {
            setTrainedDays(prev => [...prev, todayKey]);
            alert('Treino de hoje marcado como concluído!');
        } else {
            alert('Você já marcou o treino de hoje como concluído.');
        }
    };

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

    const renderWorkout = () => {
        if (!currentWorkout) {
            return (
                <section id="workout-section" className="workout-section">
                    <div className="workout-container">
                        <div className="workout-header-section">
                            <h2>Nenhum treino gerado</h2>
                            <p>Gere um treino pelo questionário para visualizar o plano completo.</p>
                            <button className="btn btn-primary" onClick={() => showSection('questionnaire')}>
                                <i className="fas fa-clipboard-list"></i> Fazer Questionário
                            </button>
                        </div>
                    </div>
                </section>
            );
        }

        if (currentWorkout.error) {
            return (
                <section id="workout-section" className="workout-section">
                    <div className="workout-container">
                        <div className="workout-header-section">
                            <h2>Erro ao gerar treino</h2>
                            <p>{currentWorkout.error}</p>
                        </div>
                    </div>
                </section>
            );
        }

        return (
            <section id="workout-section" className="workout-section">
                <div className="workout-container">
                    <div className="workout-header-section">
                        <i className="fas fa-trophy"></i>
                        <h2>Seu Treino Está Pronto!</h2>
                        <p>Baseado nas suas respostas, criamos um plano de treino personalizado e otimizado para seus objetivos.</p>
                        <div className="workout-meta">
                            <p><strong>Objetivo:</strong> {currentWorkout.meta?.objetivo}</p>
                            <p><strong>Local:</strong> {currentWorkout.meta?.local}</p>
                            <p><strong>Frequência:</strong> {currentWorkout.meta?.frequencia}</p>
                        </div>
                    </div>

                    <div id="workout-result" className="workout-result">
                        {Object.values(currentWorkout.schedule || {}).map(dayWorkout => (
                            <div key={dayWorkout.day} className="day-workout-card">
                                <h3>{dayWorkout.day} - {dayWorkout.muscleGroup}</h3>
                                <div className="day-exercises">
                                    {(dayWorkout.exercises || []).map((ex, index) => (
                                        <div key={index} className="exercise-item">
                                            <div className="exercise-name">{ex.nome}</div>
                                            <div className="exercise-details">{ex.series} Séries x {ex.reps} Repetições</div>
                                            <div className="exercise-obs">{ex.obs}</div>
                                            {ex.substituto_casa && (
                                                <div className="exercise-substitute">Substituto em casa: {ex.substituto_casa}</div>
                                            )}
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
                    </div>
                </div>
            </section>
        );
    };

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

    const renderHome = () => (
        <section id="home-section" className="home-section">
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
                    />

                    <div className="quick-actions">
                        <h3>Ações Rápidas</h3>
                        <div className="action-buttons">
                            {currentWorkout && !currentWorkout.error && (
                                <button className="action-btn" onClick={() => showSection('workout')}>
                                    <i className="fas fa-calendar-week"></i>
                                    <div>
                                        <div style={{ fontWeight: 600 }}>Ver Treino Completo</div>
                                        <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>Visualizar plano semanal</div>
                                    </div>
                                </button>
                            )}
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <div className="container">
            <header className="header">
                <div className="logo">
                    <i className="fas fa-dumbbell"></i>
                    <h1>TrainerBody</h1>
                </div>
                <p className="subtitle"> </p>

                <div className="nav-menu">
                    <button
                        className={`nav-btn ${activeSection === 'home' ? 'active' : ''}`}
                        onClick={() => showSection('home')}
                    >
                        <i className="fas fa-home"></i>
                        Início
                    </button>
                    {currentWorkout && !currentWorkout.error && (
                        <button
                            className={`nav-btn ${activeSection === 'workout' ? 'active' : ''}`}
                            onClick={() => showSection('workout')}
                        >
                            <i className="fas fa-dumbbell"></i>
                            Meu Treino
                        </button>
                    )}
                    <button
                        className={`nav-btn ${activeSection === 'imc' ? 'active' : ''}`}
                        onClick={() => showSection('imc')}
                    >
                        <i className="fas fa-calculator"></i>
                        Calculadora IMC
                    </button>
                    {/* 🔥 NOVO BOTÃO: Navegar para o perfil */}
                    <button
                        className="nav-btn profile-btn"
                        onClick={handleGoToProfile}
                    >
                        <i className="fas fa-user"></i>
                        Meu Perfil
                    </button>
                    <button
                        className="nav-btn logout-btn"
                        onClick={handleLogout}
                        style={{ marginLeft: 'auto' }}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        Sair
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
