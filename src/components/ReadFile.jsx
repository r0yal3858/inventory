import readXlsxFile from "read-excel-file";

export const ReadFile = () => {
  return (
    <>
      <input
        type="file"
        id="input"
        accept=".xlsx"
        onChange={async () => {
          console.log("running");
          const input = document.getElementById("input");
          //   const exc = await readXlsxFile(input.files[0]);
          console.log(input.files[0]);
          readXlsxFile(input.files[0]).then((rows) => {
            console.log(rows);
            // `rows` is an array of rows
            // each row being an array of cells.
          });
        }}
      />
    </>
  );
};
