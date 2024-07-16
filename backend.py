from flask import Flask,jsonify
from flask import request
from flask_mysqldb import MySQL
from flask_cors import CORS
import secrets
 
app = Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'
CORS(app,supports_credentials=True)#跨域访问

app.config['MYSQL_HOST'] = 'localhost' # MySQL主机地址
app.config['MYSQL_USER'] = 'gaidatadeal' # MySQL用户名
app.config['MYSQL_PASSWORD'] = 'root' # MySQL密码
app.config['MYSQL_DB'] = 'gaidatadeal' # MySQL数据库名
app.config["SECRET_KEY"]=secrets.token_hex(16)

db=MySQL(app)

#根节点
url_root='http://jnueca.cn:5555/gaidatadeal'
#信息提交接口
url_submit='/gaidatadeal/submit/<int:index>'
#信息请求接口
url_load='/gaidatadeal/articles/<int:index>'
#获取初始信息接口
url_get_initial_index='/gaidatadeal/get_initial_index'
#信息标记
url_mark_usefuless='/gaidatadeal/mark_not_useful/<int:index>'
@app.route(url_get_initial_index, methods=['GET'])
def get_initial_index():
    cur = db.connection.cursor()
#获取没处理信息的最小id返还
    cur.execute('SELECT note_id, id FROM data WHERE status = 0 ORDER BY id ASC LIMIT 1')
    row = cur.fetchone()
    cur.close()

    if row:
        data={
            'note_id':row[0],
            'id':row[1]
        }
        print(data)
        return jsonify(data)
    else:
        return jsonify({'error': 'No data found'})
# 根据index获取数据
@app.route(url_load, methods=['GET'])
def get_data(index):
    print(index)
    cursor = db.connection.cursor()
    cursor.execute('SELECT note_id,id FROM data WHERE id = %s',(index,))
    row = cursor.fetchone()
    cursor.close()
    if row:
        data={
            'note_id':row[0],
            'id':row[1]
        }
        return jsonify(data)
    else:
        return jsonify({'error': 'No more data'})
# 标记信息为参考意义不大
@app.route(url_mark_usefuless, methods=['POST'])
def mark_not_useful(index): 
    cursor = db.connection.cursor()
    cursor.execute('UPDATE data SET status = 3 WHERE id = %s', (index,))
    db.connection.commit()
    cursor.close()
    return jsonify({'success': True})
# 提交表单数据
@app.route(url_submit, methods=['POST'])
def submit(index):
    data = request.json
    print(index,data)
    start_point = data.get('startPoint', '')
    end_point = data.get('endPoint', '')
    budget = data.get('budget', '')
    people_count = data.get('peopleCount', 1)
    city_count = data.get('cityCount', 2)
    transport_type = data.get('transportType', '')
    details = data.get('details', '')
    cursor = db.connection.cursor()
    query = '''UPDATE data 
               SET start_point = %s, 
                   end_point = %s, 
                   budget = %s, 
                   people_count = %s, 
                   city_count = %s, 
                   transport_type = %s, 
                   details = %s, 
                   status = 1 
               WHERE id = %s;'''
    print(query)
    cursor.execute(query,(start_point,end_point,budget,int(people_count),int(city_count),transport_type,details,index))
    db.connection.commit()
    cursor.close()
    return jsonify({'success': True})
if __name__ == '__main__':
    app.run(port=5555,debug=True)