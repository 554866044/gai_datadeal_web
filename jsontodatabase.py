import json
import pymysql

# 数据库配置
db_config = {
    'user': 'root',
    'password': 'root',
    'host': 'localhost',
    'database': 'gaidatadeal',
    
}

# 读取 JSON 文件
def read_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# 将数据写入数据库
def insert_data_into_db(data):
    conn = pymysql.connect(user=db_config['user'], 
                           password=db_config['password'], 
                           host=db_config['host'], 
                           database=db_config['database'])
    cursor = conn.cursor()
    for item in data:
        note_id = item['note_id']
        cursor.execute('INSERT INTO data (note_id, status) VALUES (%s, %s)', (note_id, 0))
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    # JSON 文件路径
    json_file_path = 'C:\\IT\\MediaCrawler-new-main\\MediaCrawler-new-main\\data\\xhs\\search_contents_2024-07-08.json'

    # 读取 JSON 文件
    data = read_json_file(json_file_path)

    # 插入数据到数据库
    insert_data_into_db(data)

    print("数据插入成功")
