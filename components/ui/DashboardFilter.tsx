import React, { useEffect, useRef, useState } from "react";
import { startOfToday, endOfToday, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from "date-fns";
import { FaCaretDown } from "react-icons/fa";

interface DashboardFilterProps {
  onFilterChange: (filter: {
    filter: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  defaultValue?: string;
  custom?: any;
}

const DashboardFilter: React.FC<DashboardFilterProps> = ({ onFilterChange, defaultValue = "today", custom = null }) => {
  const [filter, setFilter] = useState("today");
  const [customDate, setCustomDate] = useState({ start: "", end: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [onlyCustom,setOnlyCustom]= useState<any>(null)
const dropdownRef = useRef<HTMLUListElement>(null);
 const [dateError,setdateError]= useState("")

  useEffect(()=>{
    setFilter(defaultValue)
    setOnlyCustom(custom)
  },[defaultValue])

  const filterOptions = [
    { value: "today", label: "Today", range: () => ({ startDate: format(startOfToday(),"yyyy-MM-dd"), endDate: format(endOfToday(),"yyyy-MM-dd") }) },
    { value: "last7Days", label: "Last 7 Days", range: () => ({ startDate: format(subDays(new Date(), 7),"yyyy-MM-dd"), endDate: format(endOfToday(),"yyyy-MM-dd") }) },
    { value: "thisMonth", label: "This Month", range: () => ({ startDate: format(startOfMonth(new Date()),"yyyy-MM-dd"), endDate: format(endOfMonth(new Date()), "yyyy-MM-dd")}) },
    { value: "lastMonth", label: "Last Month", range: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1);
      return { startDate: format(startOfMonth(lastMonth),"yyyy-MM-dd"), endDate: format(endOfMonth(lastMonth),"yyyy-MM-dd") };
    }},
    { value: "thisYear", label: "This Year", range: () => ({ startDate: format(startOfYear(new Date()),"yyyy-MM-dd"), endDate: format(new Date(),"yyyy-MM-dd") }) },
    { value: "lastYear", label: "Last Year", range: () => {
      const lastYear = new Date().getFullYear() - 1;
      return { startDate: format(startOfYear(new Date(lastYear, 0, 1)),"yyyy-MM-dd"), endDate: format(endOfYear(new Date(lastYear, 11, 31)),"yyyy-MM-dd") };
    }},
    // { value: "allTime", label: "All Time" },
    { value: "custom", label: "Custom" },
  ];

  const handleFilterChange = (newFilter:any) => {
    setFilter(newFilter);
  

    if (newFilter !== "custom" && newFilter !== "allTime") {
      const range = filterOptions.find((option) => option.value === newFilter)?.range?.();
      onFilterChange({ filter: newFilter, ...range });
      setOnlyCustom({ filter: newFilter, ...range })
      setDropdownOpen(false);
    } else if (newFilter === "allTime") {
      onFilterChange({ filter: "allTime" });
      
    }
  };

  // const handleDateChange = (e) => {
  //   const { name, value } = e.target;
  //   setCustomDate((prev) => ({ ...prev, [name]: value }));
  // };


  const handleDateChange = (e:any) => {
    const { name, value } = e.target;

    const newDates = { ...customDate, [name]: value };

    if (name === "start" && newDates.end && newDates.start > newDates.end) {
      //alert("Start date cannot be greater than end date.");
      setdateError("Start date cannot be greater than end date.")
      // setCustomDate({...customDate,start:""})
      setCustomDate((prev) => ({ ...prev, [name]: value }));
      return
     
    }else if (name === "end" && newDates.start && newDates.end < newDates.start) {
    //  alert("End date cannot be earlier than start date.");
      setdateError("End date cannot be earlier than start date.")
      setCustomDate((prev) => ({ ...prev, [name]: value }));
     // setCustomDate({...customDate,end:""})
      return
     
    }else{
      setdateError("")
      setCustomDate((prev) => ({ ...prev, [name]: value }));
    }
  
    // setCustomDate((prev) => {
    //   const newDates = { ...prev, [name]: value };
  
    //   if (name === "start" && newDates.end && newDates.start > newDates.end) {
    //     alert("Start date cannot be greater than end date.");
    //     return prev; // Prevents setting an invalid date
    //   }
  
    //   if (name === "end" && newDates.start && newDates.end < newDates.start) {
    //     alert("End date cannot be earlier than start date.");
    //     return prev; // Prevents setting an invalid date
    //   }
  
    //   return newDates;
    // });
  };
  
  

  const handleApplyCustomFilter = () => {
    if (customDate.start && customDate.end) {

      if(dateError){

        return 
      }
      setdateError("")
      setDropdownOpen(false);
      onFilterChange({ filter: "custom",startDate: customDate.start, endDate:customDate.end });
      setOnlyCustom({ filter: "custom",startDate: customDate.start, endDate:customDate.end })
    } else {
      setdateError("Please select both start and end dates.")
      return
      //alert("Please select both start and end dates.");
    }
  };


   const handleBlur = (e: any) => {
      setTimeout(() => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(document.activeElement)
        ) {
          setDropdownOpen(false);
        }
        // setIsFocused(false);
        // inputRef.current?.blur();
      }, 150);
    };
  
  return (
    <div className=" rounded-md max-w-md ">
 
      <div className="relative">
        {/* Dropdown button */}
        <button
          className="w-full flex text-sm justify-between items-center text-left px-4 py-2 bg-white shadow-sm border-blue-700 border-2 rounded-md text-gray-700 focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
         // onBlur={handleBlur}
        >
      
            {
            filterOptions.find((option) => option.value === filter)?.label=="Custom" ? 
              ` ${onlyCustom && format(onlyCustom?.startDate,"dd-MM-yyyy")} to ${onlyCustom && format(onlyCustom?.endDate,"dd-MM-yyyy")}`
                :
                filterOptions.find((option) => option.value === filter)?.label}
        
           <FaCaretDown />
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute z-40 w-[200px] bg-white border border-gray-300 rounded-md shadow-md mt-2">
            <ul className="p-0"  ref={dropdownRef}>
              {filterOptions.map((option) => (
                <li
                  key={option.value}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    filter === option.value ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleFilterChange(option.value)}
                >
                  {option.label}
                </li>
              ))}
              {/* Custom Date Picker Section */}
              {filter === "custom" && (
                <div className="px-4 py-4 border-t border-gray-200">
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-sm text-gray-600">Start Date:</label>
                      <input
                        type="date"
                        name="start"
                        value={customDate.start}
                        onChange={handleDateChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">End Date:</label>
                      <input
                        type="date"
                        name="end"
                   
                        value={customDate.end}
                        onChange={handleDateChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <span className="w-full text-red-500">{dateError}</span>
                    <button
                      onClick={handleApplyCustomFilter}
                      className="w-full bg-blue-500 text-white text-sm py-2 rounded-md mt-3 hover:bg-blue-600"
                    >
                      Filter
                    </button>
                  </div>
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardFilter;
