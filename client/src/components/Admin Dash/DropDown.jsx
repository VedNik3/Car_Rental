import { useState } from "react";
import { useDispatch } from "react-redux";
import { setClickedOption } from "../../redux/adminSlice";

const Dropdown = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleClickedOption = (item) => {
    dispatch(setClickedOption(item.label))
    
  }

  return (
    <li>
      <div
        className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
        onClick={toggleDropdown}
      >
        <span className="text-base">{title}</span>
      </div>
      {isOpen && (
        <div className="ml-4 flex flex-col space-y-2">
          {items.map((item) => (
            <div
              key={item.label}
              href={item.href}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={()=>{handleClickedOption(item)}}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </li>
  );
};

export default Dropdown;
