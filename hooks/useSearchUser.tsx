'use client'
import { useState, useEffect } from "react";

const useSearchUsers = ({
  pageCount = 1,
  pageSize = 10,
  filterData,
}: {
  pageCount: any;
  pageSize: any;
  filterData: string;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [userSearch, setuserSearch] = useState({
    content: [],
    totalElements: 0,
  });
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [storedPageCount, setPageCount] = useState(0);
  const handleInputUserChange = (value: string) => {
    setInputValue(value);
  };

  useEffect(() => {
    const fetchUserData = async () => {
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
            `/api/users/filter?${filterData}&page=${pageCount}&size=${pageSize}`
          );

          if (res.ok) {
            const dataFound = await res.json();
            console.log("dataFound>>", dataFound);
            setuserSearch({
              content: dataFound.content,
              totalElements: dataFound.totalElements,
            });
            setError(null);
          } else {
            setuserSearch({
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
                  `/api/users/search?search=${inputValue.trim()}&page=${pageCount}&size=${pageSize}`
                )
              : await fetch(
                  `/api/users?page=${pageCount}&size=${pageSize}`
                );

          if (res.ok) {
            const dataFound = await res.json();
            console.log("dataFound from search>>", dataFound);
            setuserSearch({
              content: dataFound.data,
              totalElements: dataFound.totalElements,
            });
            setError(null);
          } else {
            setuserSearch({
              content: [],
              totalElements: 0,
            });
            setError("Error fetching RolesSearch");
          }
          setLoading(false);
          console.log("userSearch>>>", userSearch);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching RolesSearch:", error);
        setuserSearch({ content: [], totalElements: 0 });
        setLoading(false);
        setError("Internal Server Error");
      }
    };

    fetchUserData();
  }, [inputValue, pageCount, pageSize]);

  return {
    inputValue,
    handleInputUserChange,
    userSearch,
    error,
    loading,
    setLoading,
  };
};

export default useSearchUsers;
