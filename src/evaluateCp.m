function res = evaluateCp(mat, T_grid)
% EVALUATECP Calculates molar and specific heat capacity using Shomate equation
% Input:
%   mat: struct with fields A, B, C, D, E, Tmin, Tmax, molarMass
%   T_grid: vector of temperatures in Kelvin
% Output:
%   res: struct with fields T, Cp_molar, Cp_specific, isValid, isWarning

T_grid = double(T_grid(:)');
t = T_grid ./ 1000.0;
% Shomate formulation: Cp = A + B*t + C*t^2 + D*t^3 + E/(t^2) [J/(mol*K)]
Cp_molar = mat.A + mat.B .* t + mat.C .* (t.^2) + mat.D .* (t.^3) + mat.E ./ (t.^2);
% Specific Cp [J/(kg*K)] = (Cp_molar / MolarMass) * 1000
Cp_specific = (Cp_molar ./ mat.molarMass) .* 1000.0;

isValid = (T_grid >= mat.Tmin) & (T_grid <= mat.Tmax);
isWarning = any(~isValid);

res = struct();
res.T = T_grid;
res.Cp_molar = Cp_molar;
res.Cp_specific = Cp_specific;
res.isValid = isValid;
res.isWarning = isWarning;
end
