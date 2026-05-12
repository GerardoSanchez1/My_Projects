document.addEventListener('DOMContentLoaded', () => {

    //Define tolerance criteria
    const epsilon = 1e-6;

    // Define diagram's lines
    const diagram = {
        A1: [{ C: 0.218, T: 727 }, { C: 0.77, T: 727 }, { C: 6.67, T: 727 }],
        A2: [{ C: 0.00, T: 768 }, { C: 0.45, T: 768 }],
        A3: [{ C: 0.00, T: 911.00 }, { C: 0.07, T: 881.31 }, { C: 0.14, T: 855.36 },
        { C: 0.21, T: 831.70 }, { C: 0.28, T: 810.34 }, { C: 0.35, T: 791.28 },
        { C: 0.45, T: 768.00 }, { C: 0.49, T: 760.05 }, { C: 0.56, T: 747.88 },
        { C: 0.63, T: 738.01 }, { C: 0.70, T: 730.43 }, { C: 0.77, T: 727.00 }],
        Acm: [{ C: 2.08, T: 1148 }, { C: 1.92, T: 1100 }, { C: 1.55, T: 1000 },
        { C: 1.22, T: 900 }, { C: 0.94, T: 800 }, { C: 0.77, T: 727 }],
        solidus_delta: [{ C: 0.00, T: 1538 }, { C: 0.09, T: 1495 }],
        solidus_gamma: [{ C: 0.17, T: 1495 }, { C: 0.42, T: 1450 }, { C: 0.71, T: 1400 },
        { C: 1.01, T: 1350 }, { C: 1.3, T: 1300 }, { C: 1.59, T: 1250 },
        { C: 1.85, T: 1200 }, { C: 2.08, T: 1148 }],
        liquidus: [{ C: 0.00, T: 1538 }, { C: 0.53, T: 1495 }, { C: 1.21, T: 1450 },
        { C: 1.88, T: 1400 }, { C: 2.47, T: 1350 }, { C: 3.02, T: 1300 },
        { C: 3.50, T: 1250 }, { C: 3.93, T: 1200 }, { C: 4.26, T: 1148 }],
        liquidus_graphite: [{ C: 7.05, T: 2100 }, { C: 6.63, T: 2000 }, { C: 6.26, T: 1900 },
        { C: 5.94, T: 1800 }, { C: 5.66, T: 1700 }, { C: 5.4, T: 1600 },
        { C: 5.14, T: 1500 }, { C: 4.88, T: 1400 }, { C: 4.63, T: 1300 },
        { C: 4.37, T: 1200 }, { C: 4.26, T: 1148 }],
        liquidus_Fe3C: [{ C: 6.67, T: 1227 }, { C: 4.26, T: 1148 }],
        L1: [{ C: 0.09, T: 1495 }, { C: 0.17, T: 1495 }, { C: 0.53, T: 1495 }],
        L2: [{ C: 2.08, T: 1148 }, { C: 4.26, T: 1148 }, { C: 6.67, T: 1148 }],
        L11: [{ C: 0.09, T: 1495 }, { C: 0.00, T: 1394 }],
        L12: [{ C: 0.17, T: 1495 }, { C: 0.00, T: 1394 }],
        L21: [{ C: 0.00, T: 911 }, { C: 0.218, T: 727 }],
        L22: [{ C: 0.218, T: 727.00 }, { C: 0.160, T: 712.56 }, { C: 0.100, T: 682.09 },
        { C: 0.080, T: 671.05 }, { C: 0.060, T: 654.46 }, { C: 0.040, T: 626.48 },
        { C: 0.020, T: 579.39 }, { C: 0.008, T: 500.00 }, { C: 0.008, T: 0.00 }],
        pure_iron: [{ C: 0, T: 0 }, { C: 0, T: 1538 }],
        Fe3c_limit: [{ C: 6.67, T: 0 }, { C: 6.67, T: 1227 }]
    };

    // Define invariant points
    const invariant_points = {
        eutectoid: { C: 0.77, T: 727 },
        eutectic: { C: 4.26, T: 1147 },
        peritectic: { C: 0.17, T: 1495 }
    };

    // Custom colors tailored for the dark modern aesthetic
    const colors = {
        A1: '#7c3aed',
        A2: '#9333ea',
        A3: '#059669',
        Acm: '#ea580c',
        liquidus: '#dc2626',
        liquidus_graphite: '#b91c1c',
        liquidus_Fe3C: '#f97316',
        gamma_solidus: '#2563eb',
        delta_solidus: '#0ea5e9',
        L1: '#475569',
        L2: '#475569',
        L11: '#ccca66ff',
        L12: '#b0d646ff',
        L21: '#4776b8ff',
        L22: '#6bafb4ff',
        horizontal: '#64748b',
        austenite: '#16a34a',
        ferrite: '#0891b2',
        cementite: '#6b7280',
        anotations: '#0f172a'
    };

    // Helper function to create line traces
    const createTrace = (name, x, y, color, dash = 'solid') => ({
        x: x,
        y: y,
        mode: 'lines',
        name: name,
        line: {
            color: color,
            width: 3,
            dash: dash,
        },
        type: 'scatter',
        hovertemplate: '<b>' + name + '</b><br>Carbon: %{x:.2f} Pct<br>Temp: %{y:.0f} °C<extra></extra>'
    });

    // Helper function to create points
    const createPoint = (name, x, y, color) => ({
        x: [x],
        y: [y],
        mode: 'markers',
        name: name,
        marker: {
            color: color,
            size: 5,
            symbol: 'circle',
            line: {
                color: '#0f172a',
                width: 2
            }
        },
        type: 'scatter',
        hovertemplate: '<b>' + name + '</b><br>Carbon: %{x:.2f} Pct<br>Temp: %{y:.0f} °C<extra></extra>'
    });

    //Increase number of points 
    function interpolate(points, n) {
        let interpoalted_lines = [];

        for (let i = 0; i < points.length - 1; i++) {
            let p1 = points[i];
            let p2 = points[i + 1];

            for (let j = 0; j < n; j++) {
                let t = j / n;

                interpoalted_lines.push({ C: p1.C + t * (p2.C - p1.C), T: p1.T + t * (p2.T - p1.T) });
            }
        }
        interpoalted_lines.push(points[points.length - 1]);
        return interpoalted_lines;
    }

    smooth_lines = {
        A1: interpolate(diagram.A1, 100),
        A2: interpolate(diagram.A2, 100),
        A3: interpolate(diagram.A3, 100),
        Acm: interpolate(diagram.Acm, 100),
        liquidus: interpolate(diagram.liquidus, 100),
        liquidus_graphite: interpolate(diagram.liquidus_graphite, 100),
        liquidus_Fe3C: interpolate(diagram.liquidus_Fe3C, 100),
        delta_solidus: interpolate(diagram.solidus_delta, 100),
        gamma_solidus: interpolate(diagram.solidus_gamma, 100),
        L1: interpolate(diagram.L1, 100),
        L2: interpolate(diagram.L2, 100),
        L11: interpolate(diagram.L11, 100),
        L12: interpolate(diagram.L12, 100),
        L21: interpolate(diagram.L21, 100),
        L22: interpolate(diagram.L22, 100),
        pure_iron: interpolate(diagram.pure_iron, 100),
        Fe3c_limit: interpolate(diagram.Fe3c_limit, 100)
    }

    const traces = [
        createTrace('A1', smooth_lines.A1.map(p => p.C), smooth_lines.A1.map(p => p.T), colors.A1),
        createTrace('A2', smooth_lines.A2.map(p => p.C), smooth_lines.A2.map(p => p.T), '#475569', 'dash'),
        createTrace('A3', smooth_lines.A3.map(p => p.C), smooth_lines.A3.map(p => p.T), colors.A3),
        createTrace('Acm', smooth_lines.Acm.map(p => p.C), smooth_lines.Acm.map(p => p.T), colors.Acm),
        createTrace('Liquidus', smooth_lines.liquidus.map(p => p.C), smooth_lines.liquidus.map(p => p.T), colors.liquidus),
        createTrace('Liquidus (graphite)', smooth_lines.liquidus_graphite.map(p => p.C), smooth_lines.liquidus_graphite.map(p => p.T), colors.liquidus_graphite, 'dash'),
        createTrace('Liquidus (Fe₃C)', smooth_lines.liquidus_Fe3C.map(p => p.C), smooth_lines.liquidus_Fe3C.map(p => p.T), colors.liquidus_Fe3C),
        createTrace('Solidus (δ)', smooth_lines.delta_solidus.map(p => p.C), smooth_lines.delta_solidus.map(p => p.T), colors.delta_solidus),
        createTrace('Solidus (γ)', smooth_lines.gamma_solidus.map(p => p.C), smooth_lines.gamma_solidus.map(p => p.T), colors.gamma_solidus),
        createTrace('δ solvus', smooth_lines.L11.map(p => p.C), smooth_lines.L11.map(p => p.T), colors.L11),
        createTrace('δ-γ', smooth_lines.L12.map(p => p.C), smooth_lines.L12.map(p => p.T), colors.L12),
        createTrace('α-γ', smooth_lines.L21.map(p => p.C), smooth_lines.L21.map(p => p.T), colors.L21),
        createTrace('α solvus', smooth_lines.L22.map(p => p.C), smooth_lines.L22.map(p => p.T), colors.L22),
        createTrace('Peritectic (1495°C)', smooth_lines.L1.map(p => p.C), smooth_lines.L1.map(p => p.T), colors.L1),
        createTrace('Eutectic (1147°C)', smooth_lines.L2.map(p => p.C), smooth_lines.L2.map(p => p.T), colors.L2),
        createTrace('Pure Iron', smooth_lines.pure_iron.map(p => p.C), smooth_lines.pure_iron.map(p => p.T), colors.cementite),
        createTrace('Fe₃C', smooth_lines.Fe3c_limit.map(p => p.C), smooth_lines.Fe3c_limit.map(p => p.T), colors.cementite),
        { ...createPoint('Eutectoid point', invariant_points.eutectoid.C, invariant_points.eutectoid.T, colors.anotations), showlegend: false },
        { ...createPoint('Eutectic point', invariant_points.eutectic.C, invariant_points.eutectic.T, colors.anotations), showlegend: false },
        { ...createPoint('Peritectic point', invariant_points.peritectic.C, invariant_points.peritectic.T, colors.anotations), showlegend: false },
        { ...createTrace('Eutectoid line indicator', [0.77, 0.77], [0, 727], colors.cementite, 'dash'), showlegend: false },
        { ...createTrace('Steel to cast iron line indicator', [2.08, 2.08], [0, 1148], colors.cementite, 'dash'), showlegend: false },
        { ...createTrace('Peritectic line indicator', [0.17, 0.17], [0, 1495], colors.cementite, 'dash'), showlegend: false },
        { ...createTrace('Eutectic line indicator', [4.26, 4.26], [0, 1148], colors.cementite, 'dash'), showlegend: false }
    ];

    var data = [{
        x: [1],
        y: [10],
        mode: 'markers',
        type: 'scatter',
        marker: { size: 12, color: 'blue' }
    }];

    const annotations = [
        { x: 3.5, y: 1500, text: '<b>Liquid (L)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 0.03, y: 1490, text: '<b>(δ)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 0.5, y: 1100, text: '<b>(γ)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 0.05, y: 730, text: '<b>(α)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 6.8, y: 500, text: '<b>(Fe₃C)</b>', showarrow: false, font: { size: 14, color: colors.anotations } }, /*textangle: -90*/
        { x: 2.0, y: 1300, text: '<b>(γ + L)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 0.2, y: 1510, text: '<b>(δ + L)</b>', showarrow: false, font: { size: 14, color: colors.anotations } }, /*showarrow: true, ax: 0, ay: 30, arrowcolor: '#94a3b8',*/
        { x: 6.0, y: 1175, text: '<b>(L + Fe₃C)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 5.5, y: 1500, text: '<b>(L + graphite)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 0.1, y: 1465, text: '<b>(δ + γ)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 3.5, y: 1050, text: '<b>(γ + Fe₃C)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 0.25, y: 790, text: '<b>(α + γ)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 3.5, y: 500, text: '<b>(α + Fe₃C)</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 1.04, y: 50, text: '<b>Steel</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 2.08, y: 25, ax: 0, ay: 25, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 2, arrowwidth: 2, text: '' },
        { x: 0, y: 25, ax: 2.08, ay: 25, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 2, arrowwidth: 2, text: '' },
        { x: 0.38, y: 100, text: '<b>Hypo-eutectoid</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 0.77, y: 75, ax: 0, ay: 75, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 2, arrowwidth: 2, text: '' },
        { x: 0, y: 75, ax: 0.077, ay: 75, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 2, arrowwidth: 2, text: '' },
        { x: 1.42, y: 100, text: '<b>Hyper-eutectoid</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 0.77, y: 75, ax: 2.08, ay: 75, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 2, arrowwidth: 2, text: '' },
        { x: 2.08, y: 75, ax: 0.077, ay: 75, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 2, arrowwidth: 2, text: '' },
        { x: 4.38, y: 50, text: '<b>Cast iron</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 2.08, y: 25, ax: 6.67, ay: 25, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 2, arrowwidth: 2, text: '' },
        { x: 6.67, y: 25, ax: 2.08, ay: 25, xref: 'x', yref: 'y', axref: 'x', ayref: 'y', showarrow: true, arrowhead: 2, arrowwidth: 2, text: '' },
        { x: 0.47, y: 300, text: '<b>α + perlite</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 1.42, y: 300, text: '<b>perlite + Fe₃C</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 3.17, y: 300, text: '<b>perlite + ledeburite II+ Fe₃C</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 5.47, y: 300, text: '<b>ledeburite II + Fe₃C</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 1.42, y: 900, text: '<b>γ + Fe₃C</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 3.17, y: 900, text: '<b>γ + ledeburite I + Fe₃C</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 5.47, y: 900, text: '<b>ledeburite I + Fe₃C</b>', showarrow: false, font: { size: 14, color: colors.anotations } },
        { x: 0.05, y: 250, text: '<b>0.008 Pct C</b>', showarrow: false, font: { size: 14, color: colors.anotations }, textangle: -90 },
        { x: 6.35, y: 1450, text: '<b>α = Ferrite<br>δ = Delta iron<br>γ = Austenite<br>Fe₃C = Cementite</b>', showarrow: false, font: { size: 14, color: '#072870ff' } }
    ];

    const layout = {
        paper_bgcolor: 'transparent',
        plot_bgcolor: '#fcfcfcff',
        hovermode: 'closest',
        dragmode: 'zoom',

        xaxis: {
            title: '<b>Carbon Content (%C)</b>',
            range: [0, 7],
            gridcolor: '#475569',
            zerolinecolor: '#475569',
            tickfont: { color: '#475569', size: 15, family: 'Outfit' },
            titlefont: { color: '#0f172a', size: 15, family: 'Outfit' },
            showspikes: true,
            spikemode: 'cross',
            spikesnap: 'cursor',
            spikecolor: '#2563eb',
            spikethickness: 1,
            spikedash: 'dot'
        },

        yaxis: {
            title: '<b>Temperature (°C)</b>',
            range: [0, 1700],
            gridcolor: '#475569',
            zerolinecolor: '#475569',
            tickfont: { color: '#475569', size: 15, family: 'Outfit' },
            titlefont: { color: '#0f172a', size: 15, family: 'Outfit' },
            showspikes: true,
            standoff: 60,
            spikemode: 'cross',
            spikesnap: 'cursor',
            spikecolor: '#2563eb',
            spikethickness: 1,
            spikedash: 'dot'
        },

        showlegend: true,
        legend: {
            itemwidth: 40,
            orientation: 'h',
            x: 0.5,
            xanchor: 'center',
            y: -0.25,
            yanchor: 'auto',
            font: { color: '#0f172a', family: 'Outfit' },
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            bordercolor: '#dbe2ea',
            borderwidth: 1,
            borderpad: 8
        },

        annotations: annotations,
        margin: { l: 70, r: 20, t: 30, b: 70 },
        font: { family: 'Outfit', color: '#0f172a' }
    };

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'hoverCompareCartesian', 'hoverClosestCartesian'],
        displaylogo: false
    };

    const targetDiv = document.getElementById('plotly-div');
    Plotly.newPlot(targetDiv, traces, layout, config);

    // Coordinate tracking
    const xCoordEl = document.getElementById('x-coord');
    const yCoordEl = document.getElementById('y-coord');

    targetDiv.addEventListener('mousemove', (e) => {
        if (!targetDiv._fullLayout) return;

        const xaxis = targetDiv._fullLayout.xaxis;
        const yaxis = targetDiv._fullLayout.yaxis;
        const l = targetDiv._fullLayout.margin.l;
        const t = targetDiv._fullLayout.margin.t;

        const boundingBox = targetDiv.getBoundingClientRect();
        const xPixel = e.clientX - boundingBox.left - l;
        const yPixel = e.clientY - boundingBox.top - t;

        // Ensure we are inside the plot area
        if (xPixel >= 0 && xPixel <= xaxis._length &&
            yPixel >= 0 && yPixel <= yaxis._length) {

            const xInData = xaxis.p2c(xPixel);
            const yInData = yaxis.p2c(yPixel);

            xCoordEl.textContent = xInData.toFixed(3);
            yCoordEl.textContent = yInData.toFixed(3);
        } else {
            xCoordEl.textContent = '---';
            yCoordEl.textContent = '---';
        }
    });

    // Reset coordinates when mouse leaves the chart entirely
    targetDiv.addEventListener('mouseleave', () => {
        xCoordEl.textContent = '---';
        yCoordEl.textContent = '---';
    });

    //Get user (C, T) input
    let pct = NaN;
    let temp = NaN;
    const pctInput = document.getElementById('pct');
    const tempInput = document.getElementById('temp');
    const calcBtn = document.querySelector('.calc-btn');
    const response = document.getElementById("response");

    calcBtn.addEventListener('click', () => {
        pct = parseFloat(pctInput.value).toFixed(3);
        temp = parseFloat(tempInput.value).toFixed(3);
        if (pct == NaN || temp == NaN) {
            response.textContent = "";
        }
        else {
            response.textContent = getresponse(pct, temp);
        }
    });

    const email = "M18121460@morelia.tecnm.mx";
    const container = document.getElementById('footer-email-container');

    if (container) {
        container.innerHTML = `<a href="mailto:${email}" style="color: ${colors.anotations}; font-weight: bold;">Contact</a>`;
    };

    function getresponse(C, T) {
        //Define scope
        if (C < 0 || T < 0) {
            return "Not physically possible"
        }
        else if (C > 6.67 || T > 2100) {
            return "Not within the bounds of this diagram"
        }
        else if (T > 1538) {
            return "Liquid"
        }
        //Define invariant points
        else if (C == invariant_points.eutectic.C.toFixed(3) && T == invariant_points.eutectic.T.toFixed(3)) {
            return "Eutectic point"
        }
        else if (C == invariant_points.eutectoid.C.toFixed(3) && T == invariant_points.eutectoid.T.toFixed(3)) {
            return "Eutectoid point"
        }
        else if (C == invariant_points.peritectic.C.toFixed(3) && T == invariant_points.peritectic.T.toFixed(3)) {
            return "Peritectic point"
        }
        // Define other critical points
        else if (C == 0.218 && T == 727) {
            return "Critical point of hypo-eutectoid steel"
        }
        else if (C == 2.08 && T == 1148) {
            return "Maximum carbon solubility in γ"
        }
        else if (C == 0.09 && T == 1495) {
            return "Maximun carbon solubility in δ"
        }
        // Define horizontal boundaries
        else if (T == 727 && C > 0.218 && C < 6.67) {
            return "Eutectoid transformation boundary"
        }
        else if (T == 1148 && C > 2.08 && C < 6.67) {
            return "Eutectic transformation boundary"
        }
        else if (T == 1495 && C > 0.09 && C < 0.53) {
            return "Peritectic transformation boundary"
        }
        //Define vertical boundaries
        else if (C == 0) {
            if (T <= 911) {
                return "Pure iron - Ferrite (α)"
            }
            else if (T > 911 && T <= 1394) {
                return "Pure iron - Austenite (γ)"
            }
            else if (T > 1394 && T <= 1538) {
                return "Pure iron - δ iron"
            }
        }
        else if (C == 6.67) {
            if (T <= 1227) {
                return "Cementite (Fe₃C)"
            }
            else if (T > 1227) {
                return "Liquid (L)"
            }
        }

        const lines_names = ["A3", "Acm",
            "liquidus", "liquidus_Fe3C",
            "delta_solidus", "gamma_solidus",
            "L11", "L12", "L21", "L22"
        ];
        const correct_names = ["A3", "Acm",
            "Liquidus", "Liquidus (Fe₃C)",
            "Solidus (δ)", "Solidus (γ)",
            "δ solvus", "δ-γ", "α-γ", "α solvus"
        ];

        // Determine the line containing T and their respective C values at T
        const reduced_names = []
        const reduced_correct_names = []
        const reduced_C = []
        for (let i = 0; i < lines_names.length; i++) {
            const line = smooth_lines[lines_names[i]];
            const T_max = line[0].T;
            const T_min = line[line.length - 1].T
            if (T >= T_min && T <= T_max) {
                reduced_names.push(lines_names[i]);
                reduced_correct_names.push(correct_names[i]);
                let interpolated_C = get_C(T, line);
                reduced_C.push(interpolated_C);
            }
        }

        // Check if any C in reduced_C is equal to the user's C input
        for (let i = 0; i < reduced_C.length; i++) {
            if (Math.abs(reduced_C[i] - C) < epsilon) {
                return "You are on the " + reduced_correct_names[i] + " boundary";
            }
        }

        // Get the neighbouring left and right lines
        let left_C = 0;
        let left_name = "pure-iron";
        let right_C = 6.67;
        let right_name = "Fe₃C";

        for (let i = 0; i < reduced_names.length; i++) {
            if (reduced_C[i] < C) {
                if (reduced_C[i] > left_C) {
                    left_C = reduced_C[i];
                    left_name = reduced_names[i];
                }
            }
            if (reduced_C[i] > C) {
                if (reduced_C[i] < right_C) {
                    right_C = reduced_C[i];
                    right_name = reduced_names[i];
                }
            }
        }

        // Ferrite
        if (left_name == "pure-iron" && (right_name == "L21" || right_name == "L22")) {
            return "Ferrite (α)";
        }

        // Austenite
        else if (left_name == "pure-iron" && (right_name == "Acm" || right_name == "gamma_solidus")) {
            return "Austenite (γ)";
        }
        else if (left_name == "A3" && right_name == "Acm") {
            return "Austenite (γ)";
        }
        else if (left_name == "L12" && right_name == "gamma_solidus") {
            return "Austenite (γ)";
        }

        // Delta iron
        else if (left_name == "pure-iron" && (right_name == "delta_solidus" || right_name == "L11")) {
            return "Delta iron (δ)";
        }

        // Liquid
        else if (left_name == "liquidus" && (right_name == "liquidus_Fe3C" || right_name == "Fe₃C")) {
            return "Liquid (L)";
        }

        // Ferrite + cementite
        else if (left_name == "L22" && right_name == "Fe₃C") {
            let pct = lever_rule(left_C, right_C, C);
            return "Ferrite (α): " + pct[0] + " %, Cementite (Fe₃C): " + pct[1] + " %";
        }

        // Ferrite + austenite
        else if (left_name == "L21" && right_name == "A3") {
            let pct = lever_rule(left_C, right_C, C);
            return "Ferrite (α): " + pct[0] + " %, Austenite (γ): " + pct[1] + " %";
        }

        // Austenite + cementite
        else if (left_name == "Acm" && right_name == "Fe₃C") {
            let pct = lever_rule(left_C, right_C, C);
            return "Austenite (γ): " + pct[0] + " %, Cementite (Fe₃C): " + pct[1] + " %";
        }

        // Austenite + liquid
        else if (left_name == "gamma_solidus" && right_name == "liquidus") {
            let pct = lever_rule(left_C, right_C, C);
            return "Austenite (γ): " + pct[0] + " %, Liquid (L): " + pct[1] + " %";
        }

        // Liquid + cementite
        else if (left_name == "liquidus_Fe3C" && right_name == "Fe₃C") {
            let pct = lever_rule(left_C, right_C, C);
            return "Liquid (L): " + pct[0] + " %, Cementite (Fe₃C): " + pct[1] + " %";
        }

        // Delta iron + austenite
        else if (left_name == "L11" && right_name == "L12") {
            let pct = lever_rule(left_C, right_C, C);
            return "Delta iron (δ): " + pct[0] + " %, Austenite (γ): " + pct[1] + " %";
        }

        // Delta iron + liquid
        else if (left_name == "delta_solidus" && right_name == "liquidus") {
            let pct = lever_rule(left_C, right_C, C);
            return "Delta iron (δ): " + pct[0] + " %, Liquid (L): " + pct[1] + " %";
        }
        else {
            return "Oops! Somehow you found a not defined point."; //+ left_name + " and " + right_name;
        }
    }

    //Intepolate Pct C
    function get_C(T, list) { // [{C: 0.07, T: 881}, ..., {C: 0.14, T: 855}]
        if (Math.abs(T - list[0].T) < epsilon) {
            return list[0].C;
        }

        if (Math.abs(T - list[list.length - 1].T) < epsilon) {
            return list[list.length - 1].C;
        }
        for (let i = 1; i < list.length; i++) {
            let T_0 = list[i - 1].T;
            let T_1 = list[i].T;
            let C_0 = list[i - 1].C;
            let C_1 = list[i].C;
            if (T <= T_0 && T >= T_1) {
                return C_0 + (T - T_0) * (C_1 - C_0) / (T_1 - T_0);
            }
        }
    }

    function lever_rule(C_left, C_right, C) {
        pct_left = (C_right - C) / (C_right - C_left) * 100;
        pct_right = 100 - pct_left;
        return [pct_left.toFixed(3), pct_right.toFixed(3)];
    }
});

/*α δ γ Fe₃C*/