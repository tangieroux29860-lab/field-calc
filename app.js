// Global state
let currentUnit = null;
const unitConversions = {
    'meters': { 'meters': 1, 'feet': 3.28084, 'cm': 100, 'mm': 1000, 'inches': 39.3701 },
    'feet': { 'meters': 0.3048, 'feet': 1, 'cm': 30.48, 'mm': 304.8, 'inches': 12 },
    'cm': { 'meters': 0.01, 'feet': 0.0328084, 'cm': 1, 'mm': 10, 'inches': 0.393701 },
    'mm': { 'meters': 0.001, 'feet': 0.00328084, 'cm': 0.1, 'mm': 1, 'inches': 0.0393701 },
    'inches': { 'meters': 0.0254, 'feet': 0.0833333, 'cm': 2.54, 'mm': 25.4, 'inches': 1 }
};

const unitLabels = {
    'meters': 'm',
    'feet': 'ft',
    'cm': 'cm',
    'mm': 'mm',
    'inches': 'in'
};

function selectUnit(unit) {
    currentUnit = unit;
    document.querySelectorAll('.unit-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    updateUnitDisplay();
    setTimeout(() => {
        document.getElementById('unitScreen').classList.remove('active');
        document.getElementById('calculatorScreen').classList.add('active');
    }, 300);
}

function changeUnit() {
    document.getElementById('calculatorScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('unitScreen').classList.add('active');
}

function updateUnitDisplay() {
    document.getElementById('unitDisplay').textContent = `Unit: ${currentUnit.charAt(0).toUpperCase() + currentUnit.slice(1)}`;
}

function openCalculator(type) {
    document.getElementById('calculatorScreen').classList.remove('active');
    document.getElementById('resultsScreen').classList.add('active');
    
    // Hide all calculators
    document.querySelectorAll('.calculator-panel').forEach(p => p.style.display = 'none');
    
    // Show selected calculator
    document.getElementById(type + '-calc').style.display = 'flex';
}

function backToMenu() {
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('calculatorScreen').classList.add('active');
    // Clear results
    document.querySelectorAll('[id$="-results"]').forEach(r => r.style.display = 'none');
}

function switchTab(calc, tab) {
    // Remove active from all tabs
    document.querySelectorAll(`#${calc}-calc .tab-btn`).forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll(`#${calc}-calc .tab-content`).forEach(content => content.classList.remove('active'));
    
    // Add active to clicked tab
    event.target.classList.add('active');
    document.getElementById(`${calc}-${tab}`).classList.add('active');
}

// SLOPE CALCULATIONS
function calculateSlope(type) {
    let result = {};
    let error = null;
    
    try {
        if (type === 'twopoints') {
            const p1e = parseFloat(document.getElementById('slope-p1e').value);
            const p1n = parseFloat(document.getElementById('slope-p1n').value);
            const p1z = parseFloat(document.getElementById('slope-p1z').value);
            const p2e = parseFloat(document.getElementById('slope-p2e').value);
            const p2n = parseFloat(document.getElementById('slope-p2n').value);
            const p2z = parseFloat(document.getElementById('slope-p2z').value);
            
            if (isNaN(p1e) || isNaN(p1n) || isNaN(p1z) || isNaN(p2e) || isNaN(p2n) || isNaN(p2z)) {
                error = 'Please fill all coordinate fields';
            } else {
                const deltaE = p2e - p1e;
                const deltaN = p2n - p1n;
                const deltaZ = p2z - p1z;
                const horizontalDist = Math.sqrt(deltaE * deltaE + deltaN * deltaN);
                const slope3d = Math.sqrt(horizontalDist * horizontalDist + deltaZ * deltaZ);
                const slopePercent = (Math.abs(deltaZ) / (horizontalDist > 0 ? horizontalDist : 1)) * 100;
                const slopeAngle = Math.atan2(Math.abs(deltaZ), horizontalDist > 0 ? horizontalDist : 0.0001) * (180 / Math.PI);
                
                result = {
                    'Horizontal Distance': horizontalDist.toFixed(4),
                    'Vertical Distance (Z)': deltaZ.toFixed(4),
                    '3D Distance': slope3d.toFixed(4),
                    'Slope Angle': slopeAngle.toFixed(2) + '°',
                    'Slope Percent': slopePercent.toFixed(2) + '%',
                    'Unit': unitLabels[currentUnit]
                };
            }
        } else if (type === 'distances') {
            const horiz = parseFloat(document.getElementById('slope-horiz').value);
            const vert = parseFloat(document.getElementById('slope-vert').value);
            
            if (isNaN(horiz) || isNaN(vert)) {
                error = 'Please fill all distance fields';
            } else {
                const slope3d = Math.sqrt(horiz * horiz + vert * vert);
                const slopePercent = (Math.abs(vert) / (horiz > 0 ? horiz : 1)) * 100;
                const slopeAngle = Math.atan2(Math.abs(vert), horiz > 0 ? horiz : 0.0001) * (180 / Math.PI);
                
                result = {
                    'Horizontal Distance': horiz.toFixed(4),
                    'Vertical Distance': vert.toFixed(4),
                    '3D Distance': slope3d.toFixed(4),
                    'Slope Angle': slopeAngle.toFixed(2) + '°',
                    'Slope Percent': slopePercent.toFixed(2) + '%',
                    'Unit': unitLabels[currentUnit]
                };
            }
        } else if (type === 'threepoints') {
            const p1e = parseFloat(document.getElementById('slope3-p1e').value);
            const p1n = parseFloat(document.getElementById('slope3-p1n').value);
            const p2e = parseFloat(document.getElementById('slope3-p2e').value);
            const p2n = parseFloat(document.getElementById('slope3-p2n').value);
            const p3e = parseFloat(document.getElementById('slope3-p3e').value);
            const p3n = parseFloat(document.getElementById('slope3-p3n').value);
            
            if (isNaN(p1e) || isNaN(p1n) || isNaN(p2e) || isNaN(p2n) || isNaN(p3e) || isNaN(p3n)) {
                error = 'Please fill all coordinate fields';
            } else {
                // Vector from vertex to point 1
                const v1e = p1e - p2e;
                const v1n = p1n - p2n;
                // Vector from vertex to point 3
                const v2e = p3e - p2e;
                const v2n = p3n - p2n;
                
                const dot = v1e * v2e + v1n * v2n;
                const mag1 = Math.sqrt(v1e * v1e + v1n * v1n);
                const mag2 = Math.sqrt(v2e * v2e + v2n * v2n);
                
                if (mag1 === 0 || mag2 === 0) {
                    error = 'Points cannot be at the same location';
                } else {
                    const cosAngle = dot / (mag1 * mag2);
                    const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
                    
                    result = {
                        'Angle between Points': angle.toFixed(2) + '°',
                        'Distance P1 to Vertex': mag1.toFixed(4),
                        'Distance P3 to Vertex': mag2.toFixed(4),
                        'Unit': unitLabels[currentUnit]
                    };
                }
            }
        }
    } catch (e) {
        error = 'Calculation error: ' + e.message;
    }
    
    displayResults('slope', result, error);
}

// CIRCLE CENTER CALCULATIONS
function calculateCircle(type) {
    let result = {};
    let error = null;
    
    try {
        if (type === 'threepoints') {
            const p1e = parseFloat(document.getElementById('circ-p1e').value);
            const p1n = parseFloat(document.getElementById('circ-p1n').value);
            const p2e = parseFloat(document.getElementById('circ-p2e').value);
            const p2n = parseFloat(document.getElementById('circ-p2n').value);
            const p3e = parseFloat(document.getElementById('circ-p3e').value);
            const p3n = parseFloat(document.getElementById('circ-p3n').value);
            
            if (isNaN(p1e) || isNaN(p1n) || isNaN(p2e) || isNaN(p2n) || isNaN(p3e) || isNaN(p3n)) {
                error = 'Please fill all coordinate fields';
            } else {
                // Circle center from 3 points
                const ax = p1e, ay = p1n;
                const bx = p2e, by = p2n;
                const cx = p3e, cy = p3n;
                
                const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
                
                if (Math.abs(d) < 1e-10) {
                    error = 'Points are collinear (cannot form a circle)';
                } else {
                    const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
                    const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
                    
                    const radius = Math.sqrt((ax - ux) * (ax - ux) + (ay - uy) * (ay - uy));
                    
                    result = {
                        'Center East': ux.toFixed(4),
                        'Center North': uy.toFixed(4),
                        'Radius': radius.toFixed(4),
                        'Unit': unitLabels[currentUnit]
                    };
                }
            }
        } else if (type === 'twopoints') {
            const p1e = parseFloat(document.getElementById('circ2-p1e').value);
            const p1n = parseFloat(document.getElementById('circ2-p1n').value);
            const p2e = parseFloat(document.getElementById('circ2-p2e').value);
            const p2n = parseFloat(document.getElementById('circ2-p2n').value);
            const radius = parseFloat(document.getElementById('circ2-radius').value);
            
            if (isNaN(p1e) || isNaN(p1n) || isNaN(p2e) || isNaN(p2n) || isNaN(radius)) {
                error = 'Please fill all fields';
            } else if (radius <= 0) {
                error = 'Radius must be positive';
            } else {
                const midE = (p1e + p2e) / 2;
                const midN = (p1n + p2n) / 2;
                const d = Math.sqrt((p2e - p1e) * (p2e - p1e) + (p2n - p1n) * (p2n - p1n));
                
                if (d > 2 * radius) {
                    error = 'Points are too far apart for this radius';
                } else {
                    const h = Math.sqrt(radius * radius - (d / 2) * (d / 2));
                    const px = (p2n - p1n) / d;
                    const py = (p1e - p2e) / d;
                    
                    // Two possible centers
                    const c1e = midE + h * px;
                    const c1n = midN + h * py;
                    
                    result = {
                        'Center 1 East': c1e.toFixed(4),
                        'Center 1 North': c1n.toFixed(4),
                        'Center 2 East': (midE - h * px).toFixed(4),
                        'Center 2 North': (midN - h * py).toFixed(4),
                        'Radius': radius.toFixed(4),
                        'Unit': unitLabels[currentUnit]
                    };
                }
            }
        }
    } catch (e) {
        error = 'Calculation error: ' + e.message;
    }
    
    displayResults('circle', result, error);
}

// POINT TO LINE DISTANCE
function calculatePointToLine(type) {
    let result = {};
    let error = null;
    
    try {
        if (type === '2d') {
            const l1e = parseFloat(document.getElementById('pl2d-l1e').value);
            const l1n = parseFloat(document.getElementById('pl2d-l1n').value);
            const l2e = parseFloat(document.getElementById('pl2d-l2e').value);
            const l2n = parseFloat(document.getElementById('pl2d-l2n').value);
            const pe = parseFloat(document.getElementById('pl2d-pe').value);
            const pn = parseFloat(document.getElementById('pl2d-pn').value);
            
            if (isNaN(l1e) || isNaN(l1n) || isNaN(l2e) || isNaN(l2n) || isNaN(pe) || isNaN(pn)) {
                error = 'Please fill all coordinate fields';
            } else {
                const dx = l2e - l1e;
                const dy = l2n - l1n;
                const lineLengthSq = dx * dx + dy * dy;
                
                if (lineLengthSq < 1e-10) {
                    error = 'Line points must be different';
                } else {
                    // Project point onto line
                    const t = ((pe - l1e) * dx + (pn - l1n) * dy) / lineLengthSq;
                    const projE = l1e + t * dx;
                    const projN = l1n + t * dy;
                    
                    // Perpendicular distance
                    const perpDist = Math.sqrt((pe - projE) * (pe - projE) + (pn - projN) * (pn - projN));
                    
                    // Along line distance
                    const lineLength = Math.sqrt(lineLengthSq);
                    const alongDist = Math.sqrt((projE - l1e) * (projE - l1e) + (projN - l1n) * (projN - l1n));
                    
                    // Line bearing (Grid North = 0°)
                    let bearing = Math.atan2(dx, dy) * (180 / Math.PI);
                    if (bearing < 0) bearing += 360;
                    
                    // Delta E, N
                    const deltaE = pe - l1e;
                    const deltaN = pn - l1n;
                    
                    result = {
                        'Perpendicular Distance': perpDist.toFixed(4),
                        'Along Line Distance': alongDist.toFixed(4),
                        'ΔE (East)': deltaE.toFixed(4),
                        'ΔN (North)': deltaN.toFixed(4),
                        'Line Bearing': bearing.toFixed(2) + '°',
                        'Unit': unitLabels[currentUnit]
                    };
                }
            }
        } else if (type === '3d') {
            const l1e = parseFloat(document.getElementById('pl3d-l1e').value);
            const l1n = parseFloat(document.getElementById('pl3d-l1n').value);
            const l1z = parseFloat(document.getElementById('pl3d-l1z').value);
            const l2e = parseFloat(document.getElementById('pl3d-l2e').value);
            const l2n = parseFloat(document.getElementById('pl3d-l2n').value);
            const l2z = parseFloat(document.getElementById('pl3d-l2z').value);
            const pe = parseFloat(document.getElementById('pl3d-pe').value);
            const pn = parseFloat(document.getElementById('pl3d-pn').value);
            const pz = parseFloat(document.getElementById('pl3d-pz').value);
            
            if (isNaN(l1e) || isNaN(l1n) || isNaN(l1z) || isNaN(l2e) || isNaN(l2n) || isNaN(l2z) || isNaN(pe) || isNaN(pn) || isNaN(pz)) {
                error = 'Please fill all coordinate fields';
            } else {
                const dx = l2e - l1e;
                const dy = l2n - l1n;
                const dz = l2z - l1z;
                const lineLengthSq = dx * dx + dy * dy + dz * dz;
                
                if (lineLengthSq < 1e-10) {
                    error = 'Line points must be different';
                } else {
                    // Project point onto line
                    const t = ((pe - l1e) * dx + (pn - l1n) * dy + (pz - l1z) * dz) / lineLengthSq;
                    const projE = l1e + t * dx;
                    const projN = l1n + t * dy;
                    const projZ = l1z + t * dz;
                    
                    // Perpendicular distance
                    const perpDist = Math.sqrt((pe - projE) * (pe - projE) + (pn - projN) * (pn - projN) + (pz - projZ) * (pz - projZ));
                    
                    // Along line distance
                    const alongDist = Math.sqrt((projE - l1e) * (projE - l1e) + (projN - l1n) * (projN - l1n) + (projZ - l1z) * (projZ - l1z));
                    
                    // Line bearing (Grid North = 0°, ignoring Z)
                    const horizDist = Math.sqrt(dx * dx + dy * dy);
                    let bearing = Math.atan2(dx, dy) * (180 / Math.PI);
                    if (bearing < 0) bearing += 360;
                    
                    // Delta E, N, Z
                    const deltaE = pe - l1e;
                    const deltaN = pn - l1n;
                    const deltaZ = pz - l1z;
                    
                    result = {
                        'Perpendicular Distance': perpDist.toFixed(4),
                        'Along Line Distance': alongDist.toFixed(4),
                        'ΔE (East)': deltaE.toFixed(4),
                        'ΔN (North)': deltaN.toFixed(4),
                        'ΔZ (Elevation)': deltaZ.toFixed(4),
                        'Line Bearing': bearing.toFixed(2) + '°',
                        'Unit': unitLabels[currentUnit]
                    };
                }
            }
        }
    } catch (e) {
        error = 'Calculation error: ' + e.message;
    }
    
    displayResults('pointline', result, error);
}

// UNIT CONVERSION
function convertUnits() {
    const fromUnit = document.getElementById('conv-from').value;
    const toUnit = document.getElementById('conv-to').value;
    const value = parseFloat(document.getElementById('conv-value').value);
    
    let result = {};
    let error = null;
    
    if (isNaN(value)) {
        error = 'Please enter a valid number';
    } else {
        const convertedValue = value * unitConversions[fromUnit][toUnit];
        result = {
            'From': value.toFixed(4) + ' ' + unitLabels[fromUnit],
            'To': convertedValue.toFixed(4) + ' ' + unitLabels[toUnit],
            'Conversion Factor': unitConversions[fromUnit][toUnit].toFixed(6)
        };
    }
    
    displayResults('conversion', result, error);
}

// CIRCLE DISTANCE
function calculateCircleDistance(type) {
    let result = {};
    let error = null;
    
    try {
        if (type === 'point') {
            const ce = parseFloat(document.getElementById('cd-ce').value);
            const cn = parseFloat(document.getElementById('cd-cn').value);
            const r = parseFloat(document.getElementById('cd-r').value);
            const pe = parseFloat(document.getElementById('cd-pe').value);
            const pn = parseFloat(document.getElementById('cd-pn').value);
            
            if (isNaN(ce) || isNaN(cn) || isNaN(r) || isNaN(pe) || isNaN(pn)) {
                error = 'Please fill all fields';
            } else if (r <= 0) {
                error = 'Radius must be positive';
            } else {
                const distToCenter = Math.sqrt((pe - ce) * (pe - ce) + (pn - cn) * (pn - cn));
                const distToCircle = Math.abs(distToCenter - r);
                const position = distToCenter < r ? 'Inside' : (distToCenter === r ? 'On' : 'Outside');
                
                result = {
                    'Distance to Center': distToCenter.toFixed(4),
                    'Distance to Circle': distToCircle.toFixed(4),
                    'Position': position + ' circle',
                    'Radius': r.toFixed(4),
                    'Unit': unitLabels[currentUnit]
                };
            }
        } else if (type === 'line') {
            const ce = parseFloat(document.getElementById('cdl-ce').value);
            const cn = parseFloat(document.getElementById('cdl-cn').value);
            const r = parseFloat(document.getElementById('cdl-r').value);
            const l1e = parseFloat(document.getElementById('cdl-l1e').value);
            const l1n = parseFloat(document.getElementById('cdl-l1n').value);
            const l2e = parseFloat(document.getElementById('cdl-l2e').value);
            const l2n = parseFloat(document.getElementById('cdl-l2n').value);
            
            if (isNaN(ce) || isNaN(cn) || isNaN(r) || isNaN(l1e) || isNaN(l1n) || isNaN(l2e) || isNaN(l2n)) {
                error = 'Please fill all fields';
            } else if (r <= 0) {
                error = 'Radius must be positive';
            } else {
                const dx = l2e - l1e;
                const dy = l2n - l1n;
                const lineLengthSq = dx * dx + dy * dy;
                
                if (lineLengthSq < 1e-10) {
                    error = 'Line points must be different';
                } else {
                    // Distance from circle center to line
                    const t = ((ce - l1e) * dx + (cn - l1n) * dy) / lineLengthSq;
                    const projE = l1e + t * dx;
                    const projN = l1n + t * dy;
                    const distToLine = Math.sqrt((ce - projE) * (ce - projE) + (cn - projN) * (cn - projN));
                    const distToCircle = Math.abs(distToLine - r);
                    const position = distToLine < r ? 'Intersects' : (distToLine === r ? 'Tangent to' : 'Outside');
                    
                    result = {
                        'Distance Center to Line': distToLine.toFixed(4),
                        'Distance Circle to Line': distToCircle.toFixed(4),
                        'Position': position,
                        'Radius': r.toFixed(4),
                        'Unit': unitLabels[currentUnit]
                    };
                }
            }
        }
    } catch (e) {
        error = 'Calculation error: ' + e.message;
    }
    
    displayResults('circledist', result, error);
}

// Display Results
function displayResults(calcType, resultObj, error) {
    const resultsDiv = document.getElementById(calcType + '-results');
    resultsDiv.innerHTML = '';
    
    if (error) {
        resultsDiv.innerHTML = `<div class="error">⚠️ ${error}</div>`;
    } else {
        let html = '';
        for (const [key, value] of Object.entries(resultObj)) {
            html += `<div class="result-item"><div class="result-label">${key}</div><div class="result-value">${value}</div></div>`;
        }
        resultsDiv.innerHTML = html;
    }
    
    resultsDiv.style.display = 'block';
}

// Install as PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}