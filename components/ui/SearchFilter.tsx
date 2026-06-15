
import React, { useEffect, useRef, useState } from "react";
import { Portal, useToast } from "@chakra-ui/react";
// import eventBus from "@/utils/event";

const SearchFilter = ({
  categories,
  onApplyFilters,
  validate,
  changeFilter = () => {},
  defaultValue = "",
  parentId = "",
  type = "",
  containerRef
}: {
  categories: { name: string; label: string }[];
  onApplyFilters: (filters: any[]) => void;
  validate: boolean;
  changeFilter?: Function;
  defaultValue: string | any;
  parentId: string | any;
  type: string;
  containerRef:any
}) => {
  const [filters, setFilters] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [selectedCategory, setSelectedCategory] = useState<any>(defaultValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const toast = useToast();
 
  useEffect(() => {
    // Filter categories based on search
    if (search) {
      const filtered = categories.filter(
        (cat) =>
          cat.label.toLowerCase().includes(search.toLowerCase()) &&
          selectedCategory.toLowerCase() !== cat.label.toLowerCase()
      );
      setFilteredCategories(filtered);
      setShowDropdown(true);
    } else {
      setFilteredCategories([]);
      setShowDropdown(false);
    }
  }, [search, categories]);

  // const handleCategorySelect = (category: any) => {
  //  // console.log("category selected>>>", category);
  //   setSelectedCategory(category.label);
  //   setSearch("");
  //   setFilteredCategories([]);
  //   setShowDropdown(false);
  //   //
  //   if (type == "incident") {

     
  //     // sendToServiceWorker(
  //     //   `/api/incident/${parentId}/assign?technicianId=${category.name}`,
  //     //   {
  //     //     id: parentId,
  //     //     technicianId: category.name,
  //     //     eventType: ACTIVITY.EDIT_INCIDENT,
  //     //     requestType: "PATCH",
  //     //   }
  //     // );
      
  //     assignToTechician(
  //       `/api/incident/${parentId}/assign?technicianId=${category.name}`,
  //       { id: parentId, technicianId: category.name }
  //     );
  //   }
  

  //   if (type == "task") {
  //     // sendToServiceWorker(
  //     //   `/api/task/${parentId}/assign?technicianId=${category.name}`,
  //     //   {
  //     //     id: parentId,
  //     //     technicianId: category.name,
  //     //     eventType: ACTIVITY.EDIT_TASK,
  //     //     requestType: "PATCH",
  //     //   }
  //     // );
  //     assignToTechician(
  //       `/api/task/${parentId}/assign?technicianId=${category.name}`,
  //       { id: parentId, technicianId: category.name }
  //     );
  //   }

  //   //    sendToServiceWorker(`/api/task/${parentId}/assign?technicianId=${category.name}`, {  requestType: "PATCH",data:{}});
  // };

  // const assignToTechician = async (endpoint, data) => {
  //   const response = await fetch(endpoint, {
  //     method: "PATCH",
  //     body: JSON.stringify(data),
  //   });

  //   if (response.ok) {
  //     const result = await response.json();
  //  //   console.log("Result after saving>>", result);
  //     eventBus.emit("ASSIGN_TASK", result);
  //     toast({
  //       title: "Success",
  //       description: result.message,
  //       status: "success", // 'info', 'warning', 'error', 'success'
  //       duration: 3000, // Duration in milliseconds
  //       isClosable: true, // Allows closing the toast
  //     });
  //   } else {
  //     const result = await response.json();
  //    // console.log("Result after error>>", result);
  //     toast({
  //       title: "Error!",
  //       description: result.message,
  //       status: "error", // 'info', 'warning', 'error', 'success'
  //       duration: 3000, // Duration in milliseconds
  //       isClosable: true, // Allows closing the toast
  //     });
  //   }
  // };

  const handleApplyFilters = () => {
    const newFilters = search
      ? [...filters, { label: "search", value: search }]
      : filters;
    onApplyFilters(newFilters);
    setFilters([]);
    setSearch("");
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(document.activeElement)
      ) {
        setShowDropdown(false);
      }
      setIsFocused(false);
      inputRef.current?.blur();
    }, 150);
  };

  return (
    // <div className="absolute top-0 ">
    <div className=" ">
      <div
        className="relative w-full  min-h-6"
        onClick={() => {
          //alert('')
          setIsFocused(true);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 100);
        }}
      >
        <div
          // onBlur={handleBlur}
          tabIndex={1}
          className={` flex-grow-0 gap-1 relative  ${
            isFocused ? "border bg-white rounded-md" : "bg-transparent"
          } `}
         
        >
          {/* {filters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center leading-2 bg-gray-100 rounded-full px-4 py-1 shadow-sm cursor-pointer gap-2"

          >
            <span className="text-[10px] leading-3 font-medium">
              {filter.label} 
            </span>
       
            <button
              className="ml-2 text-red-500 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                //handleDeleteFilter(index);
              }}
            >
              ✕
            </button>

          </div>
        ))} */}
          <div className="flex">
            {selectedCategory && (
              <div
                className={`px-2   z-40 flex justify-between items-center h-6 my-auto ${
                  isFocused
                    ? "bg-gray-100 shadow-sm rounded-full"
                    : "bg-transparent"
                }   py-1  cursor-pointer gap-2`}
                onClick={() => {
                  //alert('')
                  setIsFocused(true);
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 100);
                }}
                onBlur={handleBlur}
                //tabIndex={0}
              >
                <span className="text-sm  leading-1">{selectedCategory}</span>
                {isFocused && (
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      setSelectedCategory("");
                      inputRef.current?.focus();
                      setIsFocused(true);
                      //e.stopPropagation();
                      //handleDeleteFilter(index);
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={search}
            onFocus={(e) => {
              const filterd = selectedCategory
                ? categories.filter(
                    (r) =>
                      r.label.toLowerCase() != selectedCategory?.toLowerCase()
                  )
                : categories;

              setFilteredCategories(filterd);
              setShowDropdown(true);
              setIsFocused(true);
            }}
            onBlur={handleBlur}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full p-2  bg-transparent rounded ${
              isFocused ? "visible" : "hidden"
            }`}
            placeholder={`${isFocused ? "Search..." : ""}`}
          />
        </div>

        {showDropdown && isFocused &&
          (filteredCategories.length ? (
            // <Portal containerRef={containerRef} appendToParentPortal>
              <ul
              className="absolute z-50 w-full bg-white border mt-1 rounded shadow-md max-h-28  overflow-y-auto"
            //  ref={containerRef}
            >
              {filteredCategories.map((category) => (
                <li
                  key={category.name}
                  // onClick={(e) => {
                  //   handleCategorySelect(category);
                  //   //  e.stopPropagation()
                  // }}
                  // onMouseDown={(e) => {
                  //   handleCategorySelect(category);
                  // }}
                  
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {category.label}
                </li>
              ))}
            </ul>
            // </Portal>
          ) : (
            <ul className="absolute w-full bg-white border mt-1 rounded shadow-md max-h-40 z-10 overflow-y-auto">
              <li
                // onClick={() => handleCategorySelect(category)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                No record found
              </li>
            </ul>
          ))}

        {/* <button onClick={handleApplyFilters} className="mt-2 p-2 bg-blue-500 text-white rounded">
        Apply Filters
      </button> */}
      </div>
    </div>
  );
};

export default SearchFilter;
