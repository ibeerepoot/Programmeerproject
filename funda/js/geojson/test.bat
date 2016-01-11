
for %%f in (*.json) do (
 mapshaper -i %%f -simplify dp 6%% -o minified/%%f
)