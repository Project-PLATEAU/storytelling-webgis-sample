export const splitN = (v: string) =>
  v.split("\n").map(v => (
    <>
      {v}
      <br />
    </>
  ));
