import axios from "axios";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";

type Article = {
  id: string;
  title: string;
  body: string;
};

const List: NextPage<{ articles: Article[]; totalCount: number }> = ({
  articles,
  totalCount,
}) => {
  return (
    <div style={{ width: 600 }}>
      <h1>ブログ一覧</h1>
      <p>合計: {totalCount}</p>
      {articles.map((article) => (
        <Link key={article.id} href={`/blog/${article.id}`}>
          <a
            style={{
              marginTop: 8,
              padding: 8,
              border: "1px solid #000",
              display: "block",
            }}
          >
            <h3>{article.title}</h3>
            <p
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {article.body}
            </p>
          </a>
        </Link>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
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

  return {
    props: {
      articles: contents,
      totalCount,
    },
  };
};

export default List;
