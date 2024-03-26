// import React, { useEffect, useRef, useState } from "react";

// const ColorPicker = ({ x, y, onSelectColor }) => {
//     const [color, setColor] = useState("#000000"); // Начальный цвет
//     const [isOpen, setIsOpen] = useState(true); // Состояние открытия окна

//     const handleChange = (e) => {
//         setColor(e.target.value);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSelectColor(color);
//         setIsOpen(false); // Закрываем окно после выбора цвета
//     };

//     if (!isOpen) {
//         return null; // Если окно закрыто, возвращаем null для его скрытия
//     }

//     return (
//         <div style={{ position: "absolute", top: y, left: x }}>
//             <form onSubmit={handleSubmit}>
//                 <input type="color" value={color} onChange={handleChange} />
//                 <button type="submit">Выбрать</button>
//             </form>
//         </div>
//     );
// };

// const BilliardTable = () => {
//     const canvasRef = useRef(null);
//     const [balls, setBalls] = useState([
//         { id: 1, x: 100, y: 100, dx: 0, dy: 0, radius: 10, color: "red", friction: 0.99, mass: 1 },
//         { id: 2, x: 200, y: 200, dx: 0, dy: 0, radius: 15, color: "blue", friction: 0.98, mass: 1.5 },
//         { id: 3, x: 300, y: 300, dx: 0, dy: 0, radius: 20, color: "green", friction: 0.97, mass: 2 },
//         { id: 4, x: 250, y: 100, dx: 0, dy: 0, radius: 25, color: "orange", friction: 0.96, mass: 2.5 },
//         { id: 5, x: 600, y: 150, dx: 0, dy: 0, radius: 30, color: "purple", friction: 0.95, mass: 3 },
//     ]);
//     const [mouseDownBallId, setMouseDownBallId] = useState(null); // Шар, на котором нажата кнопка мыши
//     const [startX, setStartX] = useState(null); // Начальная позиция по оси X при нажатии мыши
//     const [startY, setStartY] = useState(null); // Начальная позиция по оси Y при нажатии мыши
//     const [selectedBallId, setSelectedBallId] = useState(null); // Выбранный шар для изменения цвета
//     const [selectedBallPosition, setSelectedBallPosition] = useState({ x: null, y: null });
//     const impactFactor = 0.5; // Коэффициент силы отталкивания

//     // Функция для рассчета координат шара относительно окна браузера
//     const calculateBallPosition = (ballId) => {
//         const ball = balls.find((ball) => ball.id === ballId);
//         if (ball) {
//             const canvasRect = canvasRef.current.getBoundingClientRect();
//             const x = canvasRect.left + ball.x;
//             const y = canvasRect.top + ball.y;
//             setSelectedBallPosition({ x, y });
//         }
//     };

//     // Обновление позиции при изменении выбранного шара
//     useEffect(() => {
//         if (selectedBallId !== null) {
//             calculateBallPosition(selectedBallId);
//         }
//     }, [selectedBallId]);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext("2d");

//         const drawBall = (x, y, radius, color) => {
//             ctx.beginPath();
//             ctx.arc(x, y, radius, 0, Math.PI * 2);
//             ctx.fillStyle = color;
//             ctx.fill();
//             ctx.closePath();
//         };

//         const update = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);

//             balls.forEach((ball) => {
//                 drawBall(ball.x, ball.y, ball.radius, ball.color);

//                 ball.dx *= ball.friction; // Применяем затухание к скорости по X
//                 ball.dy *= ball.friction; // Применяем затухание к скорости по Y

//                 ball.x += ball.dx;
//                 ball.y += ball.dy;

//                 // Проверка на столкновение с границами стола
//                 if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
//                     ball.dx = -ball.dx;
//                 }
//                 if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
//                     ball.dy = -ball.dy;
//                 }
//             });

//             // Проверка на столкновение с другими шарами
//             balls.forEach((ball, index) => {
//                 for (let i = index + 1; i < balls.length; i++) {
//                     const otherBall = balls[i];
//                     const dx = otherBall.x - ball.x;
//                     const dy = otherBall.y - ball.y;
//                     const distance = Math.sqrt(dx * dx + dy * dy);
//                     const minDistance = ball.radius + otherBall.radius;

//                     if (distance < minDistance) {
//                         // Если шары сталкиваются, меняем их направление движения с учетом их массы
//                         const normalX = dx / distance;
//                         const normalY = dy / distance;

//                         const dP = (ball.dx - otherBall.dx) * normalX + (ball.dy - otherBall.dy) * normalY;

//                         ball.dx -= (dP * normalX * impactFactor) / ball.mass;
//                         ball.dy -= (dP * normalY * impactFactor) / ball.mass;
//                         otherBall.dx += (dP * normalX * impactFactor) / otherBall.mass;
//                         otherBall.dy += (dP * normalY * impactFactor) / otherBall.mass;
//                     }
//                 }
//             });
//         };

//         const gameLoop = () => {
//             update();
//             requestAnimationFrame(gameLoop);
//         };

//         gameLoop();

//         return () => {};
//     }, [balls]); // Отслеживаем изменения в шарах

//     const handleMouseDown = (e) => {
//         const rect = canvasRef.current.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         balls.forEach((ball) => {
//             const dx = mouseX - ball.x;
//             const dy = mouseY - ball.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
//             const ballRadius = ball.radius;

//             if (distance < ballRadius) {
//                 if (e.button === 2) {
//                     // Проверяем, что клик был правой кнопкой мыши
//                     setSelectedBallId(ball.id); // Устанавливаем выбранный шар для изменения цвета
//                 } else {
//                     setMouseDownBallId(ball.id);
//                     setStartX(mouseX);
//                     setStartY(mouseY);
//                 }
//             }
//         });
//     };

//     const handleMouseUp = () => {
//         setMouseDownBallId(null);
//     };

//     const handleMouseMove = (e) => {
//         if (mouseDownBallId !== null) {
//             const rect = canvasRef.current.getBoundingClientRect();
//             const mouseX = e.clientX - rect.left;
//             const mouseY = e.clientY - rect.top;

//             const dx = mouseX - startX;
//             const dy = mouseY - startY;

//             setBalls((prevBalls) =>
//                 prevBalls.map((ball) => {
//                     if (ball.id === mouseDownBallId) {
//                         const distance = Math.sqrt(dx * dx + dy * dy);
//                         const ballRadius = ball.radius;

//                         if (distance < ballRadius) {
//                             return { ...ball, dx: dx * 1, dy: dy * 1 };
//                         } else {
//                             return ball;
//                         }
//                     } else {
//                         return ball;
//                     }
//                 })
//             );

//             setStartX(mouseX);
//             setStartY(mouseY);
//         }
//     };

//     const handleColorSelect = (color) => {
//         setBalls((prevBalls) =>
//             prevBalls.map((ball) => {
//                 if (ball.id === selectedBallId) {
//                     return { ...ball, color: color };
//                 } else {
//                     return ball;
//                 }
//             })
//         );
//     };

//     // Обработчик клика правой кнопкой мыши на шаре
//     const handleRightClick = (e) => {
//         e.preventDefault(); // Предотвращаем стандартное контекстное меню браузера
//         const rect = canvasRef.current.getBoundingClientRect();
//         const mouseX = e.clientX - rect.left;
//         const mouseY = e.clientY - rect.top;

//         balls.forEach((ball) => {
//             const dx = mouseX - ball.x;
//             const dy = mouseY - ball.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
//             const ballRadius = ball.radius;

//             if (distance < ballRadius) {
//                 setSelectedBallId(ball.id); // Устанавливаем выбранный шар для изменения цвета
//                 calculateBallPosition(ball.id); // Рассчитываем позицию выбранного шара
//             }
//         });
//     };

//     return (
//         <div>
//             <canvas
//                 ref={canvasRef}
//                 id="billiard-table"
//                 width={800}
//                 height={400}
//                 style={{ border: "1px solid black" }}
//                 onMouseDown={handleMouseDown}
//                 onMouseUp={handleMouseUp}
//                 onMouseMove={handleMouseMove}
//                 onContextMenu={handleRightClick} // Обработчик правого клика мыши
//             />
//             {selectedBallPosition.x !== null && selectedBallPosition.y !== null && (
//                 <ColorPicker
//                     x={selectedBallPosition.x}
//                     y={selectedBallPosition.y}
//                     onSelectColor={handleColorSelect} // Функция для выбора цвета шара
//                 />
//             )}
//         </div>
//     );
// };

// export default BilliardTable;

import React, { useEffect, useRef, useState } from "react";

const ColorPicker = ({ x, y, onSelectColor }) => {
    const [color, setColor] = useState("#000000"); // Начальный цвет
    const [isOpen, setIsOpen] = useState(true); // Состояние открытия окна

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest("#color-picker")) {
                setIsOpen(false); // Закрываем окно, если клик произошел вне элемента ColorPicker
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        setColor(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSelectColor(color);
        setIsOpen(false); // Закрываем окно после выбора цвета
    };

    if (!isOpen) {
        return null; // Если окно закрыто, возвращаем null для его скрытия
    }

    return (
        <div id="color-picker" style={{ position: "absolute", top: y, left: x }}>
            <form onSubmit={handleSubmit}>
                <input type="color" value={color} onChange={handleChange} />
                <button type="submit">Выбрать</button>
            </form>
        </div>
    );
};

const BilliardTable = () => {
    const canvasRef = useRef(null);
    const [balls, setBalls] = useState([
        { id: 1, x: 100, y: 100, dx: 0, dy: 0, radius: 10, color: "red", friction: 0.99, mass: 1 },
        { id: 2, x: 200, y: 200, dx: 0, dy: 0, radius: 15, color: "blue", friction: 0.98, mass: 1.5 },
        { id: 3, x: 300, y: 300, dx: 0, dy: 0, radius: 20, color: "green", friction: 0.97, mass: 2 },
        { id: 4, x: 250, y: 100, dx: 0, dy: 0, radius: 25, color: "orange", friction: 0.96, mass: 2.5 },
        { id: 5, x: 600, y: 150, dx: 0, dy: 0, radius: 30, color: "purple", friction: 0.95, mass: 3 },
    ]);
    const [mouseDownBallId, setMouseDownBallId] = useState(null); // Шар, на котором нажата кнопка мыши
    const [startX, setStartX] = useState(null); // Начальная позиция по оси X при нажатии мыши
    const [startY, setStartY] = useState(null); // Начальная позиция по оси Y при нажатии мыши
    const [selectedBallId, setSelectedBallId] = useState(null); // Выбранный шар для изменения цвета
    const [selectedBallPosition, setSelectedBallPosition] = useState({ x: null, y: null });
    const impactFactor = 0.5; // Коэффициент силы отталкивания

    // Функция для рассчета координат шара относительно окна браузера
    const calculateBallPosition = (ballId) => {
        const ball = balls.find((ball) => ball.id === ballId);
        if (ball) {
            const canvasRect = canvasRef.current.getBoundingClientRect();
            const x = canvasRect.left + ball.x;
            const y = canvasRect.top + ball.y;
            setSelectedBallPosition({ x, y });
        }
    };

    // Обновление позиции при изменении выбранного шара
    useEffect(() => {
        if (selectedBallId !== null) {
            calculateBallPosition(selectedBallId);
        }
    }, [selectedBallId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const drawBall = (x, y, radius, color) => {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        };

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            balls.forEach((ball) => {
                drawBall(ball.x, ball.y, ball.radius, ball.color);

                ball.dx *= ball.friction; // Применяем затухание к скорости по X
                ball.dy *= ball.friction; // Применяем затухание к скорости по Y

                ball.x += ball.dx;
                ball.y += ball.dy;

                // Проверка на столкновение с границами стола
                if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
                    ball.dx = -ball.dx;
                }
                if (ball.y + ball.dy > canvas.height - ball.radius || ball.y + ball.dy < ball.radius) {
                    ball.dy = -ball.dy;
                }
            });

            // Проверка на столкновение с другими шарами
            balls.forEach((ball, index) => {
                for (let i = index + 1; i < balls.length; i++) {
                    const otherBall = balls[i];
                    const dx = otherBall.x - ball.x;
                    const dy = otherBall.y - ball.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDistance = ball.radius + otherBall.radius;

                    if (distance < minDistance) {
                        // Если шары сталкиваются, меняем их направление движения с учетом их массы
                        const normalX = dx / distance;
                        const normalY = dy / distance;

                        const dP = (ball.dx - otherBall.dx) * normalX + (ball.dy - otherBall.dy) * normalY;

                        ball.dx -= (dP * normalX * impactFactor) / ball.mass;
                        ball.dy -= (dP * normalY * impactFactor) / ball.mass;
                        otherBall.dx += (dP * normalX * impactFactor) / otherBall.mass;
                        otherBall.dy += (dP * normalY * impactFactor) / otherBall.mass;
                    }
                }
            });
        };

        const gameLoop = () => {
            update();
            requestAnimationFrame(gameLoop);
        };

        gameLoop();

        return () => {};
    }, [balls]); // Отслеживаем изменения в шарах

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        balls.forEach((ball) => {
            const dx = mouseX - ball.x;
            const dy = mouseY - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const ballRadius = ball.radius;

            if (distance < ballRadius) {
                if (e.button === 2) {
                    // Проверяем, что клик был правой кнопкой мыши
                    setSelectedBallId(ball.id); // Устанавливаем выбранный шар для изменения цвета
                } else {
                    setMouseDownBallId(ball.id);
                    setStartX(mouseX);
                    setStartY(mouseY);
                }
            }
        });
    };

    const handleMouseUp = () => {
        setMouseDownBallId(null);
    };

    const handleMouseMove = (e) => {
        if (mouseDownBallId !== null) {
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const dx = mouseX - startX;
            const dy = mouseY - startY;

            setBalls((prevBalls) =>
                prevBalls.map((ball) => {
                    if (ball.id === mouseDownBallId) {
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const ballRadius = ball.radius;

                        if (distance < ballRadius) {
                            return { ...ball, dx: dx * 1, dy: dy * 1 };
                        } else {
                            return ball;
                        }
                    } else {
                        return ball;
                    }
                })
            );

            setStartX(mouseX);
            setStartY(mouseY);
        }
    };

    const handleColorSelect = (color) => {
        setBalls((prevBalls) =>
            prevBalls.map((ball) => {
                if (ball.id === selectedBallId) {
                    return { ...ball, color: color };
                } else {
                    return ball;
                }
            })
        );
        setSelectedBallId(null); // Сбрасываем выбранный шар после изменения цвета
    };

    // Обработчик клика правой кнопкой мыши на шаре
    const handleRightClick = (e) => {
        e.preventDefault(); // Предотвращаем стандартное контекстное меню браузера
        const rect = canvasRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        balls.forEach((ball) => {
            const dx = mouseX - ball.x;
            const dy = mouseY - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const ballRadius = ball.radius;

            if (distance < ballRadius) {
                setSelectedBallId(ball.id); // Устанавливаем выбранный шар для изменения цвета
                calculateBallPosition(ball.id); // Рассчитываем позицию выбранного шара
            }
        });
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                id="billiard-table"
                width={800}
                height={400}
                style={{ border: "1px solid black" }}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onContextMenu={handleRightClick} // Обработчик правого клика мыши
            />
            {selectedBallPosition.x !== null && selectedBallPosition.y !== null && (
                <ColorPicker
                    x={selectedBallPosition.x}
                    y={selectedBallPosition.y}
                    onSelectColor={handleColorSelect} // Функция для выбора цвета шара
                />
            )}
        </div>
    );
};

export default BilliardTable;
