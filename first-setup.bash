mkdir -p "$HOME/amazing_quera/resources";
if [[ ! -f "$HOME/amazing_quera/store.json" ]] ; then
echo '{"issues":[],"answers":[],"resources":[],"users":[]}' > "$HOME/amazing_quera/store.json";
fi
#todo this jwt_secret down below must be generated by system
if [[ ! -f "$HOME/amazing_quera/env.json" ]] ; then 
echo '{"jwt_secret" : "4857cn945umc893ux2SDFGSDFGinkdkljl"}' > "$HOME/amazing_quera/env.json"; 
fi 
