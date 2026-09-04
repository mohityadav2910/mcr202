function CpExplorer
% CPEXPLORER Standard, clean MATLAB App for Cp vs T analysis
dataMat = load('data/materials_data.mat', 'matList', 'T');
matList = dataMat.matList;
T = dataMat.T;

f = uifigure('Name', 'Cp vs T Materials Database Platform', 'Position', [100 100 1100 650]);
g = uigridlayout(f, [1, 2]);
g.ColumnWidth = {320, '1x'};

% Left panel: controls
pLeft = uipanel(g, 'Title', 'Material Selection & Controls');
gl = uigridlayout(pLeft, [7, 1]);
gl.RowHeight = {25, 30, 25, '1x', 25, 35, 35};

uilabel(gl, 'Text', 'Filter by Category:', 'FontWeight', 'bold');
cats = ['-- All Categories --'; unique(T.Category)];
ddCat = uidropdown(gl, 'Items', cats, 'Value', cats(1));

uilabel(gl, 'Text', 'Select Materials (Multi-select):', 'FontWeight', 'bold');
matNames = strings(height(T), 1);
for i = 1:height(T)
    matNames(i) = string(T.Materials{i}) +  ( + string(T.formula{i}) + );
end
lbMat = uilistbox(gl, 'Items', matNames, 'Multiselect', 'on', 'Value', matNames(1:min(3, length(matNames))));

uilabel(gl, 'Text', 'Units:', 'FontWeight', 'bold');
bgUnit = uibuttongroup(gl);
r1 = uiradiobutton(bgUnit, 'Text', 'J/(mol*K)', 'Position', [10 5 100 20]);
r2 = uiradiobutton(bgUnit, 'Text', 'J/(kg*K)', 'Position', [130 5 100 20]);

btnPlot = uibutton(gl, 'Text', 'Update Plot', 'ButtonPushedFcn', @(btn, event) refreshPlot());

% Right panel: plot axes
pRight = uipanel(g, 'Title', 'Specific Heat Capacity (Cp vs T) Curve');
gr = uigridlayout(pRight, [1, 1]);
ax = uiaxes(gr);
grid(ax, 'on');
title(ax, 'Cp vs Temperature');
xlabel(ax, 'Temperature T [K]');
ylabel(ax, 'Specific Heat Capacity Cp [J/(mol*K)]');
% Enable interactive toolbar for zooming, panning, datacursor values/tips, and reset view
axtoolbar(ax, {'zoomin', 'zoomout', 'pan', 'datacursor', 'restoreview'});

    function refreshPlot()
        cla(ax);
        hold(ax, 'on');
        selected = lbMat.Value;
        isMolar = strcmp(bgUnit.SelectedObject.Text, 'J/(mol*K)');
        for k = 1:length(selected)
            idx = find(matNames == selected(k), 1);
            if isempty(idx), continue; end
            m = matList{idx};
            T_grid = linspace(m.Tmin, m.Tmax, 100);
            res = evaluateCp(m, T_grid);
            if isMolar
                plot(ax, res.T, res.Cp_molar, 'LineWidth', 1.8, 'DisplayName', char(m.name));
                ylabel(ax, 'Cp [J/(mol*K)]');
            else
                plot(ax, res.T, res.Cp_specific, 'LineWidth', 1.8, 'DisplayName', char(m.name));
                ylabel(ax, 'Cp [J/(kg*K)]');
            end
        end
        legend(ax, 'show', 'Location', 'northeast');
        hold(ax, 'off');
    end

refreshPlot();
end
