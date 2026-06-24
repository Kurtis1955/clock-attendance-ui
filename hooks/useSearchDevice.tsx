import { useState, useEffect } from "react";

const useSearchDevice = ({
  pageCount = 1,
  pageSize = 10,
  filterData,
}: {
  pageCount: any;
  pageSize: any;
  filterData: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [deviceSearch, setDeviceSearch] = useState({
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

      try {
        if (inputValue.trim() === "" && storedPageCount == pageCount) {
          //  setRolesSearch([]);
          return;
        }
        setLoading(true);

        if (filterData != "") {
          const res = await fetch(
            `/api/device/filter?${filterData}&page=${pageCount}&size=${pageSize}`
          );

          if (res.ok) {
            const dataFound = await res.json();
            console.log("dataFound>>", dataFound);
            setDeviceSearch({
              content: dataFound.content,
              totalElements: dataFound.totalElements,
            });
            setError(null);
          } else {
            setDeviceSearch({
              content: [],
              totalElements: 0,
            });
            setError("Error fetching RolesSearch");
          }
          setLoading(false);
        } else {
          const res =
            inputValue.trim() != ""
              ? await fetch(
                  `/api/device?search=${inputValue.trim()}&page=${pageCount}&size=${pageSize}`
                )
              : await fetch(`/api/device?page=${pageCount}&size=${pageSize}`);

          if (res.ok) {
            const dataFound = await res.json();
            console.log("dataFound from search>>", dataFound);
            setDeviceSearch({
              content: dataFound.data,
              totalElements: dataFound.totalElements,
            });
            setError(null);
          } else {
            setDeviceSearch({
              content: [],
              totalElements: 0,
            });
            setError("Error fetching RolesSearch");
          }
          setLoading(false);
          console.log("roleSearch>>>", deviceSearch);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching RolesSearch:", error);
        setDeviceSearch({ content: [], totalElements: 0 });
        setLoading(false);
        setError("Internal Server Error");
      }
    };

    fetchRoleData();
  }, [inputValue, pageCount, pageSize]);

  return {
    inputValue,
    handleInputRoleChange,
    deviceSearch,
    error,
    loading,
    setLoading,
  };
};

export default useSearchDevice;
