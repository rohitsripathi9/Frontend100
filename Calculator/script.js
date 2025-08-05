document.addEventListener("DOMContentLoaded", function () {
    const screen = document.querySelector(".screen");
    const buttons = document.querySelectorAll(".calculator > div:not(.screen)");

    let currentInput = "";

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.textContent;

            switch (value) {
                case "AC":
                    currentInput = "";
                    break;

                case "+/-":
                    if (currentInput && currentInput !== "Error") {
                        if (currentInput.startsWith("-")) {
                            currentInput = currentInput.slice(1);
                        } else {
                            currentInput = "-" + currentInput;
                        }
                    }
                    break;

                case "%":
                    if (currentInput && currentInput !== "Error") {
                        try {
                            currentInput = String(parseFloat(currentInput) / 100);
                        } catch {
                            currentInput = "Error";
                        }
                    }
                    break;

                case "=":
                    if (currentInput && currentInput !== "Error") {
                        try {
                            const expression = currentInput.replace(/x/g, "*").replace(/÷/g, "/");
                            const result = Function('"use strict"; return (' + expression + ')')();
                            currentInput = String(result);
                        } catch {
                            currentInput = "Error";
                        }
                    }
                    break;

                default:
                    if (currentInput === "Error") currentInput = "";
                    currentInput += value;
                    break;
            }

            screen.textContent = currentInput || "0";
        });
    });
});