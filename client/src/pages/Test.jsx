import { Layout } from "lucide-react";
import React from "react";

const Test = () => {
  const templates = [
    {
      id: "classic",
      name: "Classic",
      preview:
        "A clean traditional resume format with clear sectios and professional typography",
    },
    {
      id: "modern",
      name: "Modern",
      preview:
        "Sleek design with strategic use of color and modern font choices",
    },
    {
      id: "minimal",
      name: "Minimal",
      preview: "Ultra clean design that puts your content front and center",
    },
    {
      id: "minimal-image",
      name: "Minimal Image",
      preview: "Minimal design with single image and clean typography",
    },
  ];
  return (
    <div className=' '>
      <button className=''>
        {templates.map((template) => {
          <div
            key={template.id}
            onClick={() => {
              onchange(template.id);
            }}
            className={` relative p-3 border rounded-md cursor-pointer transition-all ${selected}`}></div>;
        })}
      </button>
    </div>
  );
};

export default Test;
