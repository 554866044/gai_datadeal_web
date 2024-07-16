import React, { useEffect, useState } from 'react';
import HttpUtill from './utills/HttpUtill'
import ApiUtill from './utills/ApiUtill';
const FormPage = () => {
  const [formData, setFormData] = useState({
    startPoint: '',
    endPoint: '',
    cityCount: '',
    peopleCount: '',
    budget: '',
    transportType: '',
    details: ''
  });
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const [note_id,setnoteid] = useState(null)
  const [untreated_num,settotal_data]=useState(0)
  const [usefuldata_num,setusefuldata]=useState(0)
  const [uselessdata_num,setuselessdata]=useState(0)
  useEffect(() => {
    const fetchinfoindex=async ()=>{
        try{
            const result= await HttpUtill.get(ApiUtill.url_get_initial_index)
            setnoteid(result.note_id);
            setCurrentArticleIndex(result.id);
            settotal_data(result.untreated_num)
            setusefuldata(result.usefuldata_num)
            setuselessdata(result.uselessdata_num)
        }catch(error){console.log("拉取初始id失败")}
    }
    fetchinfoindex()
  }, []);
 
  const loadArticle = (index) => {
    const loadinfo=async ()=>{
        try{
            console.log(index)
            const result= await HttpUtill.get(`${ApiUtill.url_load}${index}`)
            setnoteid(result.note_id);
            setCurrentArticleIndex(result.id);
        }catch(error){console.log("拉取信息失败")}
    }
    loadinfo()
  };

  const handlePrevious = () => {
    if (currentArticleIndex > 1) {
      loadArticle(currentArticleIndex - 1);
    } else {
      alert('已经是第一篇文章');
    }
  };

  const handleNext = () => {
    loadArticle(currentArticleIndex + 1);
  };

  const handleNotUseful = () => {
    const handleNotUseful = async()=>{
        const result= await HttpUtill.post(`${ApiUtill.url_mark_usefuless}${currentArticleIndex}`)
        if (result.success){
        alert('该数据已标记为参考意义不大');
        handleNext()
        }
        else{
            alert('出错了！')
        }
    }
    handleNotUseful()
}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    const embeddedFrame = document.getElementById('embeddedFrame');
    const dataToSubmit = {
      url: embeddedFrame.src,
      ...formData
    };
    const submitinfo=async()=>{
        const result=HttpUtill.post(`${ApiUtill.url_submit}${currentArticleIndex}`,dataToSubmit)
        if(result.success){
            alert('数据提交成功')
            handleNext()
        }else{alert('出错了！！')}
    }
    submitinfo()
}

  return (
    <div className="container">
      <div className="embedded-section">
        <h2>数据标注网页</h2>
        <h3>请根据帖子内容完善以下表格信息，点击上/下一篇请求帖子，点击‘该篇参考意义不大’标记信息模糊帖子</h3>
        <h3>数据库信息数:{untreated_num}。已标记有效:{usefuldata_num}。标记无效:{uselessdata_num}</h3>
        <p>因为使用iframe，所以无法登录小红书，复制帖子内容请使用浏览器插件强制复制</p>
        <iframe id="embeddedFrame"  src={note_id ? `https://www.xiaohongshu.com/explore/${note_id}` : ''} width="100%" height="600px"></iframe>
        <ul>
            <button className='pagebutton' onClick={handlePrevious}>上一篇</button>
            <button className='banbutton'onClick={handleNotUseful}>该篇参考意义不大</button>
            <button className='pagebutton' onClick={handleNext}>下一篇</button>
        </ul>
      </div>

      <div className="form-section">
        <h2>信息收集部分</h2>
        <input type="text" name="startPoint" value={formData.startPoint} onChange={handleChange} placeholder="起点" />
        <input type="text" name="endPoint" value={formData.endPoint} onChange={handleChange} placeholder="终点" />
        <input type="number" name="cityCount" value={formData.cityCount} onChange={handleChange} placeholder="访问城市数量" />
        <input type="number" name="peopleCount" value={formData.peopleCount} onChange={handleChange} placeholder="人数" />
        <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="预算" />
        <input type="text" name="transportType" value={formData.transportType} onChange={handleChange} placeholder="交通类型" />
        <textarea name="details" value={formData.details} onChange={handleChange} placeholder="详情"></textarea>
      </div>

      <div className="submit-section">
        <button onClick={handleSubmit}>提交</button>
      </div>
    </div>
  );
};

export default FormPage;
