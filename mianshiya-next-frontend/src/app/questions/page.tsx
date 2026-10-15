"use server";//服务端组件
import Title from "antd/es/typography/Title";
import { message } from "antd";
import { searchQuestionVoByPageUsingPost } from "@/api/questionController";
import QuestionTable from "@/components/QuestionTable";
import "./index.css";

/**
 * 题目列表页面
 * @constructor
 */
export default async function QuestionsPage({ searchParams }) {
  // 获取 url 的查询参数
  //用户访问 /questions?q=Java 时，searchParams.q 就是 "Java"
  //{ q: searchText } 是 ES6 重命名解构语法，意思是：把从地址栏拿到的 q 改个名叫 searchText，方便后文使用
  const { q: searchText } = searchParams;
  // 题目列表和总数
  let questionList = [];
  let total = 0;

  try {
    //向后端发起查题请求
    const res = await searchQuestionVoByPageUsingPost({
      //1、传入查询条件
      searchText,//刚才传的搜索关键字
      pageSize: 12,//每页展示12题
      sortField: "createTime",//按创建时间排（最新的题目排在最前）。
      sortOrder: "descend",//倒序【升序是ascend】
    });

    //保底赋值
    //如果接口成功返回了题目数组，就用它；如果后端返回了 null 或 undefined，就保底给一个空数组 []，防止页面崩溃
    questionList = res.data.records ?? [];
    total = res.data.total ?? 0;//总题数同理，拿不到就保底为 0
  } catch (e) {
    message.error("获取题目列表失败，" + e.message);
  }

  return (
    <div id="questionsPage" className="max-width-content">
      //组装并渲染页面
      <Title level={3}>题目大全</Title>
      <QuestionTable
        defaultQuestionList={questionList}
        defaultTotal={total}
        defaultSearchParams={{
          title: searchText,
        }}
      />
    </div>
  );
}
