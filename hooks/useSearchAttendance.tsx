import { useState, useEffect } from "react";

const useSearchAttendance = ({
  pageCount = 1,
  pageSize = 10,
  filterData,
}: {
  pageCount: any;
  pageSize: any;
  filterData: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [attendanceSearch, setAttendanceSearch] = useState({
    content: [],
    totalElements: 0,
  });
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [storedPageCount, setPageCount] = useState(0);
  const handleInputRoleChange = (value: string) => {
    setInputValue(value);
  };

  useEffect(() => {
    const fetchRoleData = async () => {
      setPageCount(pageCount);

      console.log(
        "storedPageCount>>>",
        storedPageCount,
        "pageSize>>@@",
        pageSize
      );

      const payload = {
        page: pageCount,
        size: pageSize,
        sortDir: "desc",
        sortBy: "verifyTime",
      };

      try {
        if (inputValue.trim() === "" && storedPageCount == pageCount) {
          //  setattendanceSearch([]);
          return;
        }
        setLoading(true);

        if (filterData != "") {
          const res = await fetch(
            `/api/attendance/filter`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                filterData: filterData,
                pageNo: pageCount,
                pageSize: pageSize,
              }),
            }
          );

          if (res.ok) {
            const dataFound = await res.json();
            console.log("dataFound>>", dataFound);
            setAttendanceSearch({
              content: dataFound.content,
              totalElements: dataFound.totalElements,
            });
            setError(null);
          } else {
            setAttendanceSearch({
              content: [],
              totalElements: 0,
            });
            setError("Error fetching attendanceSearch");
          }
          setLoading(false);
        } else {
          const res =
            inputValue.trim() != ""
              ? await fetch(
                  `/api/attendance`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      search: inputValue.trim(),
                      pageNo: pageCount,
                      pageSize: pageSize,
                    }),
                  }
                )
              : await fetch(`/api/attendance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

          if (res.ok) {
            const dataFound = await res.json();
            console.log("dataFound from search>>", dataFound);
            setAttendanceSearch({
              content: dataFound.content,
              totalElements: dataFound.totalElements,
            });
            setError(null);
          } else {
            setAttendanceSearch({
              content: [],
              totalElements: 0,
            });
            setError("Error fetching attendanceSearch");
          }
          setLoading(false);
          console.log("attendanceearch>>>", attendanceSearch);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendanceSearch:", error);
        setAttendanceSearch({ content: [], totalElements: 0 });
        setLoading(false);
        setError("Internal Server Error");
      }
    };

    fetchRoleData();
  }, [inputValue, pageCount, pageSize]);

  return {
    inputValue,
    handleInputRoleChange,
    attendanceSearch,
    error,
    loading,
    setLoading,
  };
};

export default useSearchAttendance;
