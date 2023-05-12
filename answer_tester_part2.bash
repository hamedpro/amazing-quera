filled_template=$1
file_name="${filled_template}.py"
output="$(python3 $file_name 2>&1)"
if [[ $? != 0 ]]; then
echo "{\"type\" : \"error\" , \"value\" : \"${output}\" }"
else 
echo "{\"type\" : \"done\" , \"value\" : ${output} }"
fi 