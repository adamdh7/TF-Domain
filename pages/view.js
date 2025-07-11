// pages/view.js

export default function ViewPage({ domain, code }) {
  return (
    <div style={{ backgroundColor: "#111", color: "#0ff", padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem" }}>{domain}.tf</h1>
      <div
        dangerouslySetInnerHTML={{ __html: code }}
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#222",
          borderRadius: "10px",
          color: "#fff"
        }}
      />
    </div>
  );
}

export async function getServerSideProps(context) {
  const { domain = "unknown", code = "<h2>No content</h2>" } = context.query;

  return {
    props: {
      domain,
      code
    }
  };
}
