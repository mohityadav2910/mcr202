function res = exportTools(action, varargin)
% EXPORTTOOLS Helper routines for analytical calculations and data export
switch lower(action)
    case 'integrate'
        % varargin: {mat, T1, T2}
        mat = varargin{1};
        T1 = varargin{2};
        T2 = varargin{3};
        t1 = T1 / 1000.0;
        t2 = T2 / 1000.0;
        H = @(t) 1000.0 * (mat.A .* t + (mat.B .* (t.^2))/2 + (mat.C .* (t.^3))/3 + (mat.D .* (t.^4))/4 - mat.E ./ t);
        deltaH_molar = H(t2) - H(t1);
        deltaH_specific = (deltaH_molar / mat.molarMass) * 1000.0;
        res = struct('deltaH_molar', deltaH_molar, 'deltaH_specific', deltaH_specific);

    case 'export_csv'
        % varargin: {filename, T_grid, matList, selectedIndices, isMolar}
        filename = varargin{1};
        T_grid = varargin{2}(:)';
        matList = varargin{3};
        idx = varargin{4};
        isMolar = varargin{5};
        
        M = zeros(length(T_grid), length(idx) + 1);
        M(:, 1) = T_grid';
        varNames = {'Temperature_K'};
        for j = 1:length(idx)
            m = matList{idx(j)};
            r = evaluateCp(m, T_grid);
            if isMolar
                M(:, j+1) = r.Cp_molar';
            else
                M(:, j+1) = r.Cp_specific';
            end
            cleanName = regexprep(char(m.name), '\W', '_');
            varNames{end+1} = cleanName;
        end
        T_out = array2table(M, 'VariableNames', varNames);
        writetable(T_out, filename);
        res = true;
end
end
