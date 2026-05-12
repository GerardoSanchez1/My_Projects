# Interactive Iron-Carbon Phase Diagram

#### Video Demo: https://www.youtube.com/watch?v=zHLBO_hwbLI

#### Description:

This project consists of an interactive web-based version of the Iron-Carbon (Fe-C) phase diagram developed using HTML, CSS, and JavaScript, with Plotly.js used for graphical visualization. The main objective of the project is to provide an educational and computational tool that helps materials science students better understand one of the most important diagrams in metallurgy. In addition to visualizing the diagram itself, the application allows users to input carbon composition and temperature values in order to identify the corresponding phase or phase mixture present at those conditions.

The Iron-Carbon phase diagram is one of the fundamental tools used in materials science and metallurgical engineering because it describes the equilibrium phases present in steels and cast irons as a function of temperature and carbon content. Although many static versions of the diagram exist online and in textbooks, they usually require manual interpretation and can be difficult for beginners to understand. For this reason, I decided to develop an interactive version capable not only of displaying the diagram, but also of computationally analyzing user-defined points.

The web application, using Plotly.js, displays the most important phase boundaries of the Fe-C phase diagram. These include boundaries such as the A1, A3, Acm lines, as well as the liquidus, solidus, solvus, eutectic, eutectoid, and peritectic boundaries. Each line was manually defined using discrete data points obtained from different references. Since only a limited number of points were available, a linear interpolation technique was implemented in order to generate smoother curves and improve the visual quality of the diagram.

One of the most important aspects of the project was determining the region in which a user-defined point is located. To achieve this, the program first filters all the lines whose temperature ranges contain the user’s selected temperature. Then, for every valid line, the application calculates the carbon composition associated with that temperature using linear interpolation between neighboring points. Once the carbon composition for every line is known, the program determines which phase boundaries lie immediately to the left and right of the user’s selected carbon composition. By identifying these neighboring boundaries, the application can determine the corresponding phase region using a series of conditionals.

The backend also includes logic for detecting special case inputs. For example, if the input point lies exactly on a phase boundary or invariant point such as the eutectic, eutectoid, and peritectic points, or the boundaries that define their transformations, the program explicitly recognizes this cases and indicates the user whether they indicated a point or a boundary. In addition, horizontal transformation boundaries such as the eutectoid line are considered separately because they require special treatment compared to ordinary sloped boundaries.

Another important feature implemented in the project is the lever rule calculation for two-phase regions. When the user selects a point located inside a two-phase region, the application calculates the approximate phase fractions using the lever rule and displays the resulting percentages. This allows the application to function not only as a visualization tool, but also as a simple computational thermodynamics assistant.

The graphical representation of the phase diagram was created using Plotly.js because it allows interactive plotting directly in the browser. Plotly provides zooming, hovering, responsive scaling, and customizable traces, making it well suited for scientific visualization. Different traces were used to represent the various phase boundaries, and custom styling options such as dashed lines and smooth spline curves were added to improve readability and appearance.

A significant part of the development process involved solving numerical and logical problems related to interpolation and phase identification. Several different strategies were explored during development, including recursive searches and binary-like searches for neighboring interpolation points. Eventually, a simpler and more robust approach based on direct linear interpolation across ordered line segments was implemented. thus simplifying both code readability and reliability.

Another challenge encountered during development was handling floating-point precision errors in JavaScript. Since many values in the phase diagram contain decimal compositions, exact equality comparisons often failed because of floating-point inaccuracies. To solve this issue, a numerical tolerance value called epsilon was introduced and used throughout the project when comparing floating-point values.

The project was also designed with future improvements in mind. Some features that could be added in later versions include dynamic phase identification while moving the mouse over the diagram, visualization of representative microstructures, additional information panels, support for the stable Fe-graphite diagram, and improved modularization of the code structure. Another possible improvement would be replacing the large conditional blocks used for phase identification with a more scalable region-mapping system.

Finally, all references used to create the diagram are indicated at the footer of the web page. Each reference has a link attached that opens a new window displaying the respective web version of the source material.

In summary:
- Interactive Plotly visualization
- Smooth interpolated phase boundaries
- User-defined composition and temperature input
- Automatic phase-region identification
- Lever rule calculations for two-phase regions
- Detection of invariant points and boundaries
- Hover information for phase lines
- Error handling for invalid or out-of-range inputs
- Numerical interpolation methods
- Interactive scientific visualization in the browser
-Links to references used