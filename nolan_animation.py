from manim import *
import numpy as np
import math

class NolanCinematicAnimation(MovingCameraScene):
    def construct(self):
        # Set high quality rendering
        self.camera.background_color = BLACK
        
        # Phase 1: Create the ticking clock
        self.create_ticking_clock()
        
        # Phase 2: Zoom into gears and transition to black hole
        self.zoom_to_gears_and_blackhole()
        
        # Phase 3: Reverse time effect
        self.reverse_time_effect()
        
        # Phase 4: Shattering words
        self.shattering_words_sequence()
        
        # Phase 5: Final Nolan reveal
        self.final_nolan_reveal()

    def create_ticking_clock(self):
        """Create a detailed clock with moving hands and ticking animation"""
        # Clock face
        clock_face = Circle(radius=2.5, color=WHITE, stroke_width=4)
        clock_face.set_fill(color=DARK_GRAY, opacity=0.1)
        
        # Hour markers
        hour_markers = VGroup()
        for i in range(12):
            angle = i * PI / 6
            start_point = 2.2 * np.array([np.cos(angle), np.sin(angle), 0])
            end_point = 2.5 * np.array([np.cos(angle), np.sin(angle), 0])
            marker = Line(start_point, end_point, color=WHITE, stroke_width=3)
            hour_markers.add(marker)
        
        # Numbers
        numbers = VGroup()
        for i in range(1, 13):
            angle = (i - 3) * PI / 6  # Start from 12 o'clock
            position = 2.0 * np.array([np.cos(-angle), np.sin(-angle), 0])
            number = Text(str(i), font_size=24, color=WHITE)
            number.move_to(position)
            numbers.add(number)
        
        # Clock hands
        hour_hand = Line(ORIGIN, 1.2 * UP, color=WHITE, stroke_width=6)
        minute_hand = Line(ORIGIN, 1.8 * UP, color=WHITE, stroke_width=4)
        second_hand = Line(ORIGIN, 2.0 * UP, color=RED, stroke_width=2)
        
        # Center dot
        center_dot = Dot(ORIGIN, color=WHITE, radius=0.08)
        
        # Group clock elements
        clock = VGroup(clock_face, hour_markers, numbers, hour_hand, minute_hand, second_hand, center_dot)
        
        # Animate clock appearance
        self.play(
            FadeIn(clock_face),
            Create(hour_markers),
            Write(numbers),
            run_time=2
        )
        
        self.play(
            GrowFromCenter(hour_hand),
            GrowFromCenter(minute_hand),
            GrowFromCenter(second_hand),
            FadeIn(center_dot),
            run_time=1.5
        )
        
        # Ticking animation
        for _ in range(6):
            self.play(
                Rotate(second_hand, PI/30),
                rate_func=rush_from,
                run_time=0.5
            )
        
        # Store clock for later use
        self.clock = clock
        self.second_hand = second_hand

    def zoom_to_gears_and_blackhole(self):
        """Zoom into clock gears and transition to black hole"""
        # Create gear mechanism
        gear1 = self.create_gear(radius=0.8, teeth=12, color=GOLD)
        gear2 = self.create_gear(radius=0.6, teeth=8, color=GOLD)
        gear3 = self.create_gear(radius=0.4, teeth=6, color=GOLD)
        
        gear1.move_to(0.5 * LEFT + 0.3 * DOWN)
        gear2.move_to(0.8 * RIGHT + 0.2 * UP)
        gear3.move_to(0.2 * LEFT + 0.8 * UP)
        
        gears = VGroup(gear1, gear2, gear3)
        
        # Zoom into clock center with MovingCameraScene
        self.play(
            self.camera.frame.animate.scale(0.3).move_to(ORIGIN),
            FadeOut(self.clock),
            run_time=2
        )
        
        # Remove the zoom group code since we're using MovingCameraScene
        # Apply zoom effect by scaling the entire view
        # zoom_group = VGroup()
        # self.add(zoom_group)
        
        # Show gears
        self.play(FadeIn(gears), run_time=1.5)
        
        # Animate gears rotating
        gear_animations = [
            Rotate(gear1, 2*PI, rate_func=linear),
            Rotate(gear2, -2*PI * 12/8, rate_func=linear),
            Rotate(gear3, 2*PI * 12/6, rate_func=linear)
        ]
        
        self.play(*gear_animations, run_time=3)
        
        # Transition to black hole
        self.play(FadeOut(gears), run_time=1)
        
        # Create black hole
        black_hole = self.create_black_hole()
        
        # Reset camera and show black hole
        self.play(
            self.camera.frame.animate.scale(1/0.3).move_to(ORIGIN),
            FadeOut(gears),
            run_time=1
        )
        
        self.play(
            FadeIn(black_hole),
            run_time=2
        )
        
        # Animate black hole
        self.animate_black_hole(black_hole)
        
        self.black_hole = black_hole

    def create_gear(self, radius, teeth, color):
        """Create a gear shape"""
        gear_points = []
        for i in range(teeth * 2):
            angle = i * PI / teeth
            if i % 2 == 0:
                r = radius
            else:
                r = radius * 0.8
            point = r * np.array([np.cos(angle), np.sin(angle), 0])
            gear_points.append(point)
        
        gear = Polygon(*gear_points, color=color, fill_opacity=0.8, stroke_width=2)
        
        # Add center hole
        center_hole = Circle(radius=radius*0.2, color=BLACK, fill_opacity=1)
        
        return VGroup(gear, center_hole)

    def create_black_hole(self):
        """Create a black hole with accretion disk"""
        # Event horizon
        event_horizon = Circle(radius=0.8, color=BLACK, fill_opacity=1)
        
        # Accretion disk rings
        rings = VGroup()
        colors = [ORANGE, YELLOW, RED, PURPLE]
        
        for i, color in enumerate(colors):
            ring = Annulus(
                inner_radius=0.8 + i*0.3,
                outer_radius=0.8 + (i+1)*0.3,
                color=color,
                fill_opacity=0.6,
                stroke_width=0
            )
            rings.add(ring)
        
        # Gravitational lensing effect
        lensing_circles = VGroup()
        for i in range(3):
            circle = Circle(
                radius=2.5 + i*0.5,
                color=WHITE,
                stroke_width=2,
                stroke_opacity=0.3
            )
            lensing_circles.add(circle)
        
        return VGroup(event_horizon, rings, lensing_circles)

    def animate_black_hole(self, black_hole):
        """Animate the black hole with spacetime distortion"""
        event_horizon, rings, lensing_circles = black_hole
        
        # Rotate accretion disk
        self.play(
            Rotate(rings, 2*PI, rate_func=linear),
            Rotate(lensing_circles, PI, rate_func=linear),
            run_time=4
        )

    def reverse_time_effect(self):
        """Create the time reversal effect"""
        # Create "REVERSE" text
        reverse_text = Text("TIME REVERSAL", font_size=48, color=RED)
        reverse_text.to_edge(UP)
        
        self.play(Write(reverse_text), run_time=1)
        self.wait(0.5)
        
        # Reverse everything that happened
        # First, reverse black hole rotation
        event_horizon, rings, lensing_circles = self.black_hole
        
        self.play(
            Rotate(rings, -2*PI, rate_func=linear),
            Rotate(lensing_circles, -PI, rate_func=linear),
            run_time=2
        )
        
        # Fade out black hole and reverse text
        self.play(
            FadeOut(self.black_hole),
            FadeOut(reverse_text),
            run_time=1.5
        )
        
        # Bring back clock in reverse
        self.play(
            FadeIn(self.clock),
            run_time=1.5
        )
        
        # Reverse clock ticking
        for _ in range(6):
            self.play(
                Rotate(self.second_hand, -PI/30),
                rate_func=rush_from,
                run_time=0.3
            )
        
        # Clear everything for next phase
        self.play(FadeOut(self.clock), run_time=1)

    def shattering_words_sequence(self):
        """Create shattering glass effect for words"""
        words = ["DREAM", "REALITY", "TIME", "CHOICE"]
        
        for word in words:
            self.create_shattering_word(word)
            self.wait(0.5)

    def create_shattering_word(self, word_text):
        """Create a word that appears and shatters like glass"""
        # Create the word
        word = Text(word_text, font_size=72, color=WHITE, weight=BOLD)
        word.set_stroke(color=BLUE, width=2)
        
        # Dramatic entrance
        self.play(
            Write(word),
            word.animate.set_color(BLUE),
            run_time=1.5
        )
        
        self.wait(0.5)
        
        # Create glass shatter effect
        fragments = VGroup()
        
        # Break word into fragments
        for i in range(20):
            fragment = word.copy()
            fragment.scale(0.1)
            
            # Random position around the word
            offset = np.random.uniform(-3, 3, 3)
            offset[2] = 0
            fragment.shift(offset)
            
            # Random rotation
            fragment.rotate(np.random.uniform(0, 2*PI))
            
            fragments.add(fragment)
        
        # Shatter animation
        self.play(
            FadeOut(word),
            *[fragment.animate.scale(0.01).set_opacity(0) for fragment in fragments],
            run_time=1.5
        )

    def final_nolan_reveal(self):
        """Create the final dramatic Nolan reveal"""
        # Create spotlight effect
        spotlight = Circle(radius=4, color=WHITE, fill_opacity=0.1, stroke_width=0)
        spotlight_ring = Circle(radius=4, color=YELLOW, stroke_width=8, stroke_opacity=0.8)
        
        # Start with darkness
        darkness = Rectangle(width=20, height=20, color=BLACK, fill_opacity=0.95)
        
        self.add(darkness)
        
        # Create spotlight growing
        self.play(
            FadeIn(spotlight),
            Create(spotlight_ring),
            run_time=2
        )
        
        # Shrink spotlight to reveal text area
        self.play(
            spotlight.animate.scale(0.5),
            spotlight_ring.animate.scale(0.5),
            run_time=1.5
        )
        
        # Create "NOLAN" text with dramatic styling
        nolan_text = Text("NOLAN", font_size=96, color=WHITE, weight=BOLD)
        nolan_text.set_stroke(color=GOLD, width=3)
        
        # Magic reveal animation
        self.play(
            Write(nolan_text),
            nolan_text.animate.set_color(GOLD),
            run_time=2.5
        )
        
        # Final dramatic lighting
        final_glow = Circle(radius=2, color=YELLOW, fill_opacity=0.2, stroke_width=0)
        final_glow.move_to(nolan_text.get_center())
        
        self.play(
            FadeIn(final_glow),
            nolan_text.animate.set_stroke(width=5),
            run_time=1.5
        )
        
        # Hold the final frame
        self.wait(3)
        
        # Fade to black
        self.play(
            FadeOut(VGroup(nolan_text, spotlight, spotlight_ring, final_glow, darkness)),
            run_time=2
        )

# Configuration for high-quality rendering
config.pixel_height = 1080  # For 1080p
config.pixel_width = 1920
config.frame_rate = 60
config.quality = "high_quality"

# To render in 4K, use:
# config.pixel_height = 2160
# config.pixel_width = 3840