import axios from "axios";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";

type Article = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

const Detail: NextPage<{ article: Article }> = ({ article }) => {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>作成日: {article.createdAt}</p>
      <p>更新日: {article.updatedAt}</p>
      <article>{article.body}</article>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    data: { contents, totalCount },
  } = await axios.get<{ contents: Article[]; totalCount: number }>(
    process.env.NEXTCMS_BLOG_API_URL || "",
    {
      headers: {
        NEXTCMS_API_KEY: process.env.NEXTCMS_API_KEY || "",
        Authorization: process.env.BASIC_AUTH || "",
      },
    }
  );

  const paths = contents.map((content) => ({
    params: {
      id: content.id,
    },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const contentId = params?.id as string;
  const { data } = await axios.get<Article>(
    `${process.env.NEXTCMS_BLOG_API_URL || ""}/${contentId}`,
    {
      headers: {
        NEXTCMS_API_KEY: process.env.NEXTCMS_API_KEY || "",
        Authorization: process.env.BASIC_AUTH || "",
      },
    }
  );

  return {
    props: {
      article: data,
    },
  };
};

export default Detail;
