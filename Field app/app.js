// Global state
let currentUnit = null;
const unitConversions = {
    'meters': { 'meters': 1, 'feet': 3.2808399, 'cm': 100, 'mm': 1000, 'inches': 39.3701 },
    'feet': { 'meters': 0.30480061, 'feet': 1, 'cm': 30.480061, 'mm': 304.80061, 'inches': 12 },
    'cm': { 'meters': 0.01, 'feet': 0.03280839, 'cm': 1, 'mm': 10, 'inches': 0.393701 },
    'mm': { 'meters': 0.001, 'feet': 0.00328084, 'cm': 0.1, 'mm': 1, 'inches': 0.0393701 },
    'inches': { 'meters': 0.0254, 'feet': 0.083333, 'cm': 2.54, 'mm': 25.4, 'inches': 1 }
};

const unitLabels = {
    'meters': 'm',
    'feet': 'ft',
    'cm': 'cm',
    'mm': 'mm',
    'inches': 'in'
};

function selectUnit(unit, btn) {
    currentUnit = unit;
    // Remove selected from all buttons
    document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('selected'));
    // Add selected to clicked button
    if (btn) {
        btn.classList.add('selected');
    }
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
    
    document.querySelectorAll('.calculator-panel').forEach(p => p.style.display = 'none');
    document.getElementById(type + '-calc').style.display = 'flex';
}

function backToMenu() {
    document.getElementById('resultsScreen').classList.remove('active');
    document.getElementById('calculatorScreen').classList.add('active');
    document.querySelectorAll('[id$="-results"]').forEach(r => r.style.display = 'none');
}

function switchTab(calc, tab) {
    document.querySelectorAll(`#${calc}-calc .tab-btn`).forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll(`#${calc}-calc .tab-content`).forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`${calc}-${tab}`).classList.add('active');
}

function convertToUnit(value, outputUnit) {
    if (!currentUnit || !outputUnit) return value;
    const factor = unitConversions[currentUnit][outputUnit];
    return value * factor;
}

// SLOPE CALCULATIONS
function calculateSlope(type) {
    let result = {};
    let error = null;
    
    const outputUnit = document.getElementById('slope-output-unit')?.value || currentUnit;
    const angleType = document.getElementById('slope-angle-type')?.value || 'horizontal';
    
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
                
                let slopeAngle;
                if (angleType === 'vertical') {
                    // Angle from vertical (90° - angle from horizontal)
                    const angleHoriz = Math.atan2(Math.abs(deltaZ), horizontalDist > 0 ? horizontalDist : 0.0001) * (180 / Math.PI);
                    slopeAngle = 90 - angleHoriz;
                } else {
                    // Angle from horizontal (standard)
                    slopeAngle = Math.atan2(Math.abs(deltaZ), horizontalDist > 0 ? horizontalDist : 0.0001) * (180 / Math.PI);
                }
                
                const hDist = convertToUnit(horizontalDist, outputUnit);
                const vDist = convertToUnit(Math.abs(deltaZ), outputUnit);
                const s3d = convertToUnit(slope3d, outputUnit);
                
                result = {
                    'Horizontal Distance': hDist.toFixed(4) + ' ' + unitLabels[outputUnit],
                    'Vertical Distance': vDist.toFixed(4) + ' ' + unitLabels[outputUnit],
                    '3D Distance': s3d.toFixed(4) + ' ' + unitLabels[outputUnit],
                    'Slope Angle': slopeAngle.toFixed(4) + '°',
                    'Slope Percent': slopePercent.toFixed(4) + '%'
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
                
                let slopeAngle;
                if (angleType === 'vertical') {
                    const angleHoriz = Math.atan2(Math.abs(vert), horiz > 0 ? horiz : 0.0001) * (180 / Math.PI);
                    slopeAngle = 90 - angleHoriz;
                } else {
                    slopeAngle = Math.atan2(Math.abs(vert), horiz > 0 ? horiz : 0.0001) * (180 / Math.PI);
                }
                
                const hDist = convertToUnit(horiz, outputUnit);
                const vDist = convertToUnit(Math.abs(vert), outputUnit);
                const s3d = convertToUnit(slope3d, outputUnit);
                
                result = {
                    'Horizontal Distance': hDist.toFixed(4) + ' ' + unitLabels[outputUnit],
                    'Vertical Distance': vDist.toFixed(4) + ' ' + unitLabels[outputUnit],
                    '3D Distance': s3d.toFixed(4) + ' ' + unitLabels[outputUnit],
                    'Slope Angle': slopeAngle.toFixed(4) + '°',
                    'Slope Percent': slopePercent.toFixed(4) + '%'
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
                const v1e = p1e - p2e;
                const v1n = p1n - p2n;
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
                    
                    const d1 = convertToUnit(mag1, outputUnit);
                    const d2 = convertToUnit(mag2, outputUnit);
                    
                    result = {
                        'Angle between Points': angle.toFixed(4) + '°',
                        'Distance P1 to Vertex': d1.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'Distance P3 to Vertex': d2.toFixed(4) + ' ' + unitLabels[outputUnit]
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
    
    const outputUnit = document.getElementById('circle-output-unit')?.value || currentUnit;
    
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
                    const radiusOut = convertToUnit(radius, outputUnit);
                    
                    result = {
                        'Center East': ux.toFixed(4),
                        'Center North': uy.toFixed(4),
                        'Radius': radiusOut.toFixed(4) + ' ' + unitLabels[outputUnit]
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
    
    const outputUnit = document.getElementById('pointline-output-unit')?.value || currentUnit;
    
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
                    const t = ((pe - l1e) * dx + (pn - l1n) * dy) / lineLengthSq;
                    const projE = l1e + t * dx;
                    const projN = l1n + t * dy;
                    
                    const perpDist = Math.sqrt((pe - projE) * (pe - projE) + (pn - projN) * (pn - projN));
                    const alongDist = Math.sqrt((projE - l1e) * (projE - l1e) + (projN - l1n) * (projN - l1n));
                    
                    let bearing = Math.atan2(dx, dy) * (180 / Math.PI);
                    if (bearing < 0) bearing += 360;
                    
                    const deltaE = pe - projE;
                    const deltaN = pn - projN;
                    
                    const perpDistOut = convertToUnit(perpDist, outputUnit);
                    const alongDistOut = convertToUnit(alongDist, outputUnit);
                    const deltaEOut = convertToUnit(deltaE, outputUnit);
                    const deltaNOut = convertToUnit(deltaN, outputUnit);
                    
                    result = {
                        'Perpendicular Distance': perpDistOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'Along Line Distance': alongDistOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'ΔE (from projection)': deltaEOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'ΔN (from projection)': deltaNOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'Line Bearing': bearing.toFixed(4) + '°'
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
                    const t = ((pe - l1e) * dx + (pn - l1n) * dy + (pz - l1z) * dz) / lineLengthSq;
                    const projE = l1e + t * dx;
                    const projN = l1n + t * dy;
                    const projZ = l1z + t * dz;
                    
                    const perpDist = Math.sqrt((pe - projE) * (pe - projE) + (pn - projN) * (pn - projN) + (pz - projZ) * (pz - projZ));
                    const alongDist = Math.sqrt((projE - l1e) * (projE - l1e) + (projN - l1n) * (projN - l1n) + (projZ - l1z) * (projZ - l1z));
                    
                    let bearing = Math.atan2(dx, dy) * (180 / Math.PI);
                    if (bearing < 0) bearing += 360;
                    
                    const deltaE = pe - projE;
                    const deltaN = pn - projN;
                    const deltaZ = pz - projZ;
                    
                    const perpDistOut = convertToUnit(perpDist, outputUnit);
                    const alongDistOut = convertToUnit(alongDist, outputUnit);
                    const deltaEOut = convertToUnit(deltaE, outputUnit);
                    const deltaNOut = convertToUnit(deltaN, outputUnit);
                    const deltaZOut = convertToUnit(deltaZ, outputUnit);
                    
                    result = {
                        'Perpendicular Distance': perpDistOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'Along Line Distance': alongDistOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'ΔE (from projection)': deltaEOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'ΔN (from projection)': deltaNOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'ΔZ (from projection)': deltaZOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'Line Bearing': bearing.toFixed(4) + '°'
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
            'Conversion Factor': unitConversions[fromUnit][toUnit].toFixed(8)
        };
    }
    
    displayResults('conversion', result, error);
}

function convertToFeetInch(decimalFeet) {
    const feet = Math.floor(decimalFeet);
    const remainingFeet = decimalFeet - feet;
    const totalInches = remainingFeet * 12;
    const inches = Math.floor(totalInches);
    const remainingInches = totalInches - inches;
    const thirtyseconds = Math.round(remainingInches * 32);
    if (thirtyseconds === 32) {
        return convertToFeetInch(feet + (inches + 1) / 12);
    }
    let numerator = thirtyseconds;
    let denominator = 32;
    if (numerator === 0) {
        return feet + "' " + inches + '"';
    }
    const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
    const divisor = gcd(numerator, denominator);
    numerator /= divisor;
    denominator /= divisor;
    return feet + "' " + inches + " " + numerator + "/" + denominator + '"';
}

function convertFeetInch() {
    const value = parseFloat(document.getElementById('conv-fi-value').value);
    const fromUnit = document.getElementById('conv-fi-from').value;
    let result = {};
    let error = null;
    if (isNaN(value)) {
        error = 'Please enter a valid number';
    } else {
        const valueInFeet = value * unitConversions[fromUnit]['feet'];
        const feetInchFormat = convertToFeetInch(valueInFeet);
        result = {
            'From': value.toFixed(4) + ' ' + unitLabels[fromUnit],
            'To (Feet-Inch)': feetInchFormat,
            'Decimal Feet': valueInFeet.toFixed(4) + ' ft'
        };
    }
    displayResults('conversion', result, error);
}

// CIRCLE DISTANCE
function calculateCircleDistance(type) {
    let result = {};
    let error = null;
    
    const outputUnit = document.getElementById('circledist-output-unit')?.value || currentUnit;
    
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
                
                const distOut = convertToUnit(distToCenter, outputUnit);
                const distCircleOut = convertToUnit(distToCircle, outputUnit);
                const radiusOut = convertToUnit(r, outputUnit);
                
                result = {
                    'Distance to Center': distOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                    'Distance to Circle': distCircleOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                    'Position': position + ' circle',
                    'Radius': radiusOut.toFixed(4) + ' ' + unitLabels[outputUnit]
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
                    const t = ((ce - l1e) * dx + (cn - l1n) * dy) / lineLengthSq;
                    const projE = l1e + t * dx;
                    const projN = l1n + t * dy;
                    const distToLine = Math.sqrt((ce - projE) * (ce - projE) + (cn - projN) * (cn - projN));
                    const distToCircle = Math.abs(distToLine - r);
                    const position = distToLine < r ? 'Intersects' : (distToLine === r ? 'Tangent to' : 'Outside');
                    
                    const distOut = convertToUnit(distToLine, outputUnit);
                    const distCircleOut = convertToUnit(distToCircle, outputUnit);
                    const radiusOut = convertToUnit(r, outputUnit);
                    
                    result = {
                        'Distance Center to Line': distOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'Distance Circle to Line': distCircleOut.toFixed(4) + ' ' + unitLabels[outputUnit],
                        'Position': position,
                        'Radius': radiusOut.toFixed(4) + ' ' + unitLabels[outputUnit]
                    };
                }
            }
        }
    } catch (e) {
        error = 'Calculation error: ' + e.message;
    }
    
    displayResults('circledist', result, error);
}

// INTERSECTIONS (2D, ENZ output)
function iv(id) {
    return parseFloat(document.getElementById(id).value);
}

function intersectOut(points, unit) {
    const res = {};
    points.forEach(p => {
        res[p.label + ' East'] = convertToUnit(p.e, unit).toFixed(4) + ' ' + unitLabels[unit];
        res[p.label + ' North'] = convertToUnit(p.n, unit).toFixed(4) + ' ' + unitLabels[unit];
    });
    return res;
}

function calculateIntersect(type) {
    let result = {};
    let error = null;
    const unit = document.getElementById('intersect-output-unit')?.value || currentUnit;

    try {
        if (type === 'linline') {
            const v = [iv('ll-p1e'), iv('ll-p1n'), iv('ll-p2e'), iv('ll-p2n'), iv('ll-p3e'), iv('ll-p3n'), iv('ll-p4e'), iv('ll-p4n')];
            if (v.some(isNaN)) {
                error = 'Please fill all coordinate fields';
            } else {
                const [ax, ay, bx, by, cx, cy, dx, dy] = v;
                const rx = bx - ax, ry = by - ay;
                const sx = dx - cx, sy = dy - cy;
                const den = rx * sy - ry * sx;
                if (Math.abs(den) < 1e-12) {
                    error = 'Lines are parallel (no single intersection)';
                } else {
                    const t = ((cx - ax) * sy - (cy - ay) * sx) / den;
                    result = intersectOut([{ label: 'Intersection', e: ax + t * rx, n: ay + t * ry }], unit);
                }
            }
        } else if (type === 'circcirc') {
            const v = [iv('cc-c1e'), iv('cc-c1n'), iv('cc-r1'), iv('cc-c2e'), iv('cc-c2n'), iv('cc-r2')];
            if (v.some(isNaN)) {
                error = 'Please fill all fields';
            } else if (v[2] <= 0 || v[5] <= 0) {
                error = 'Radius must be positive';
            } else {
                const [x1, y1, r1, x2, y2, r2] = v;
                const dx = x2 - x1, dy = y2 - y1;
                const d = Math.hypot(dx, dy);
                if (d < 1e-12) {
                    error = 'Circles have the same center';
                } else if (d > r1 + r2 + 1e-9 || d < Math.abs(r1 - r2) - 1e-9) {
                    error = 'Circles do not intersect';
                } else {
                    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
                    const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
                    const mx = x1 + a * dx / d, my = y1 + a * dy / d;
                    const pts = [{ label: 'Point 1', e: mx - h * dy / d, n: my + h * dx / d }];
                    if (h > 1e-9) pts.push({ label: 'Point 2', e: mx + h * dy / d, n: my - h * dx / d });
                    result = intersectOut(pts, unit);
                }
            }
        } else if (type === 'linecirc') {
            const v = [iv('lc-p1e'), iv('lc-p1n'), iv('lc-p2e'), iv('lc-p2n'), iv('lc-ce'), iv('lc-cn'), iv('lc-r')];
            if (v.some(isNaN)) {
                error = 'Please fill all fields';
            } else if (v[6] <= 0) {
                error = 'Radius must be positive';
            } else {
                const [ax, ay, bx, by, cx, cy, r] = v;
                const dx = bx - ax, dy = by - ay;
                const fx = ax - cx, fy = ay - cy;
                const A = dx * dx + dy * dy;
                if (A < 1e-12) {
                    error = 'Line points must be different';
                } else {
                    const B = 2 * (fx * dx + fy * dy);
                    const C = fx * fx + fy * fy - r * r;
                    const disc = B * B - 4 * A * C;
                    if (disc < 0) {
                        error = 'Line does not intersect the circle';
                    } else {
                        const sq = Math.sqrt(disc);
                        const t1 = (-B - sq) / (2 * A), t2 = (-B + sq) / (2 * A);
                        const tol = 1e-9;
                        const cand = [{ label: 'Point 1', t: t1 }];
                        if (disc > 1e-12) cand.push({ label: 'Point 2', t: t2 });
                        // Keep only points lying on the segment A-B (t between 0 and 1)
                        const pts = cand
                            .filter(c => c.t >= -tol && c.t <= 1 + tol)
                            .map(c => ({ label: c.label, e: ax + c.t * dx, n: ay + c.t * dy }));
                        if (pts.length === 0) {
                            error = 'No intersection within the line segment';
                        } else {
                            result = intersectOut(pts, unit);
                        }
                    }
                }
            }
        }
    } catch (e) {
        error = 'Calculation error: ' + e.message;
    }

    displayResults('intersect', result, error);
}

// INTERSECTIONS 3D
function setIntersectDim(dim) {
    document.getElementById('intersect-2d-wrap').style.display = dim === '2d' ? 'block' : 'none';
    document.getElementById('intersect-3d-wrap').style.display = dim === '3d' ? 'block' : 'none';
    document.getElementById('dim-2d-btn').classList.toggle('active', dim === '2d');
    document.getElementById('dim-3d-btn').classList.toggle('active', dim === '3d');
    document.getElementById('intersect-results').style.display = 'none';
}

function intersectOut3(points, unit) {
    const res = {};
    const u = unitLabels[unit];
    points.forEach(item => {
        res[item.label + ' East'] = convertToUnit(item.p[0], unit).toFixed(4) + ' ' + u;
        res[item.label + ' North'] = convertToUnit(item.p[1], unit).toFixed(4) + ' ' + u;
        res[item.label + ' Z'] = convertToUnit(item.p[2], unit).toFixed(4) + ' ' + u;
    });
    return res;
}

function calculateIntersect3D(type) {
    let result = {};
    let error = null;
    const unit = document.getElementById('intersect-output-unit')?.value || currentUnit;
    const tolD = 1e-4; // distance tolerance in input units (0.1 mm if meters)

    try {
        if (type === 'linline') {
            const v = [iv('ll3-p1e'), iv('ll3-p1n'), iv('ll3-p1z'), iv('ll3-p2e'), iv('ll3-p2n'), iv('ll3-p2z'), iv('ll3-p3e'), iv('ll3-p3n'), iv('ll3-p3z'), iv('ll3-p4e'), iv('ll3-p4n'), iv('ll3-p4z')];
            if (v.some(isNaN)) {
                error = 'Please fill all coordinate fields';
            } else {
                const A = v.slice(0, 3), B = v.slice(3, 6), C = v.slice(6, 9), D = v.slice(9, 12);
                const u = [B[0] - A[0], B[1] - A[1], B[2] - A[2]];
                const w = [D[0] - C[0], D[1] - C[1], D[2] - C[2]];
                const w0 = [A[0] - C[0], A[1] - C[1], A[2] - C[2]];
                const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
                const a = dot(u, u), b = dot(u, w), c = dot(w, w), d = dot(u, w0), e = dot(w, w0);
                const den = a * c - b * b;
                if (Math.abs(den) < 1e-12) {
                    error = 'Lines are parallel (no unique closest point)';
                } else {
                    const t = (b * e - c * d) / den;
                    const s = (a * e - b * d) / den;
                    const P = [A[0] + t * u[0], A[1] + t * u[1], A[2] + t * u[2]];
                    const Q = [C[0] + s * w[0], C[1] + s * w[1], C[2] + s * w[2]];
                    const gap = Math.sqrt((P[0] - Q[0]) ** 2 + (P[1] - Q[1]) ** 2 + (P[2] - Q[2]) ** 2);
                    if (gap < tolD) {
                        result = intersectOut3([{ label: 'Intersection', p: P }], unit);
                    } else {
                        result = intersectOut3([{ label: 'Closest point Line 1', p: P }, { label: 'Closest point Line 2', p: Q }], unit);
                        result['Minimum distance (lines do not meet)'] = convertToUnit(gap, unit).toFixed(4) + ' ' + unitLabels[unit];
                    }
                }
            }
        } else if (type === 'linecirc') {
            const v = [iv('lc3-p1e'), iv('lc3-p1n'), iv('lc3-p1z'), iv('lc3-p2e'), iv('lc3-p2n'), iv('lc3-p2z'), iv('lc3-ce'), iv('lc3-cn'), iv('lc3-cz'), iv('lc3-r')];
            if (v.some(isNaN)) {
                error = 'Please fill all fields';
            } else if (v[9] <= 0) {
                error = 'Radius must be positive';
            } else {
                const A = v.slice(0, 3), B = v.slice(3, 6);
                const cx = v[6], cy = v[7], cz = v[8], r = v[9];
                const dz = B[2] - A[2];
                if (Math.abs(dz) < 1e-12) {
                    error = 'Line is level (constant Z): it cannot cross the circle plane at one point';
                } else {
                    const t = (cz - A[2]) / dz;
                    if (t < -1e-9 || t > 1 + 1e-9) {
                        error = 'Line segment does not reach the circle plane (Z)';
                    } else {
                        const P = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1]), cz];
                        const miss = Math.abs(Math.hypot(P[0] - cx, P[1] - cy) - r);
                        if (miss > tolD) {
                            error = 'Line crosses the circle plane but misses the circle by ' + convertToUnit(miss, unit).toFixed(4) + ' ' + unitLabels[unit];
                        } else {
                            result = intersectOut3([{ label: 'Intersection', p: P }], unit);
                        }
                    }
                }
            }
        } else if (type === 'circcirc') {
            const v = [iv('cc3-c1e'), iv('cc3-c1n'), iv('cc3-c1z'), iv('cc3-r1'), iv('cc3-c2e'), iv('cc3-c2n'), iv('cc3-c2z'), iv('cc3-r2')];
            if (v.some(isNaN)) {
                error = 'Please fill all fields';
            } else if (v[3] <= 0 || v[7] <= 0) {
                error = 'Radius must be positive';
            } else if (Math.abs(v[2] - v[6]) > tolD) {
                error = 'Circles are at different Z (no intersection)';
            } else {
                const x1 = v[0], y1 = v[1], z1 = v[2], r1 = v[3], x2 = v[4], y2 = v[5], r2 = v[7];
                const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
                if (d < 1e-12) {
                    error = 'Circles have the same center';
                } else if (d > r1 + r2 + tolD || d < Math.abs(r1 - r2) - tolD) {
                    error = 'Circles do not intersect';
                } else {
                    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
                    const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
                    const mx = x1 + a * dx / d, my = y1 + a * dy / d;
                    const pts = [{ label: 'Point 1', p: [mx - h * dy / d, my + h * dx / d, z1] }];
                    if (h > tolD) pts.push({ label: 'Point 2', p: [mx + h * dy / d, my - h * dx / d, z1] });
                    result = intersectOut3(pts, unit);
                }
            }
        }
    } catch (e) {
        error = 'Calculation error: ' + e.message;
    }

    displayResults('intersect', result, error);
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
    // Clear old service workers
    navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(reg => reg.unregister());
    });
    // Register new one
    setTimeout(() => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    }, 500);
}
