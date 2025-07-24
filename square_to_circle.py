from manim import *

class SquareToCircle(Scene):
    def construct(self):
        square = Square()           # Create a square
        circle = Circle()           # Create a circle

        self.play(Create(square))   # Animate drawing the square
        self.play(Transform(square, circle))  # Transform square → circle
        self.play(FadeOut(circle))  # Fade out at end
