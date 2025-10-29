import { Briefcase, Plus, Sparkles, Trash2 } from "lucide-react";
import React from "react";

const ExperienceForm = ({ data, onChange }) => {
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  const removeExperience = (index) => {
    const experience = data.filter((_, i) => i !== index);
    onChange(experience);
  };

  const updateExperience = (index, field, value) => {
    const updatedExperience = [...data];
    updateExperience[index] = { ...updateExperience[index], [field]: value };
    onChange(updatedExperience);
  };

  return (
    <div className=' space-y-6'>
      <div className=' flex items-center justify-between'>
        {/* Left Side */}
        <div>
          <h3 className=' flex items-center gap-2 text-lg font-semibold text-gray-900'>
            Professional Experience
          </h3>
          <p className=' text-sm text-gray-500'>Add your job experience</p>
        </div>

        {/* Right Side */}
        <button
          onClick={addExperience}
          className=' flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors'>
          <Plus className=' size-4' />
          Add Experience
        </button>
      </div>
      {data.length === 0 ? (
        <div className=' text-center py-8 text-gray-500'>
          <Briefcase className=' w-12 h-12 mx-auto mb-3 text-gray-300' />
          <p>No Work Experience added yet</p>
          <p className=' text-sm'>Click Add Experience to get started</p>
        </div>
      ) : (
        <div className=' space-y-6'>
          {data.map((experience, index) => (
            <div
              key={index}
              className=' p-4 border border-gray-200 rounded-lg space-y-3'>
              {/* Delete experience */}
              <div className=' flex justify-between items-center'>
                <h4>Experience #{index + 1}</h4>
                <button
                  onClick={() => removeExperience(index)}
                  className=' text-red-500 hover:text-red-700 transition-colors'>
                  <Trash2 className=' size-4' />
                </button>
              </div>

              {/* Update experience */}
              <div className=' grid md:grid-cols-2 gap-3'>
                <input
                  type='text'
                  placeholder='Company name'
                  className=' px-3 py-2 text-sm rounded-lg'
                  value={experience.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                />
                <input
                  type='text'
                  placeholder='Job Title'
                  className=' px-3 py-2 text-sm rounded-lg'
                  value={experience.position || ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                />
                <input
                  type='month'
                  className=' px-3 py-2 text-sm rounded-lg'
                  value={experience.start_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "start_date", e.target.value)
                  }
                />
                <input
                  disabled={experience.is_current}
                  type='month'
                  className=' px-3 py-2 text-sm rounded-lg disabled:bg-gray-100'
                  value={experience.end_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                />
              </div>
              <label className=' flex items-center gap-2'>
                <input
                  type='checkbox'
                  className=' rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  checked={experience.is_current || false}
                  onChange={(e) =>
                    updateExperience(
                      index,
                      "is_current",
                      e.target.checked ? true : false
                    )
                  }
                />
                <span className=' text-sm text-gray-700'>
                  Currently working here
                </span>
              </label>
              <div className=' space-y-2'>
                <div className=' flex items-center justify-between'>
                  <label
                    className=' text-sm font-medium text-gray-700'
                    htmlFor=''>
                    Job Description
                  </label>
                  <button className=' flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                    <Sparkles className=' w-3 h-3' />
                    Enhance with AI
                  </button>
                </div>
                <textarea
                  value={experience.description || ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  className=' w-full text-sm px-3 py-2 rounded-lg resize-none'
                  placeholder='Describe your key responsibilities and achievements...'
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
