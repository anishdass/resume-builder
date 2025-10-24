import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeftIcon,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  GraduationCap,
  Sparkles,
  User,
} from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";

const ResumeBuilder = () => {
  const { resumeId } = useParams();

  const [activeSectionIndex, setactiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: Folder },
    { id: "skills", name: "Skills", icon: Sparkles },
  ];

  const activeSection = sections[activeSectionIndex];

  const [resumeData, setResumeData] = useState({
    _id: "",
    title: "",
    personal_info: "",
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3b82f6",
    public: false,
  });

  const loadExistingResume = async () => {
    const resume = dummyResumeData.find((resume) => resume._id === resumeId);
    console.log(dummyResumeData);
    if (resumeData) {
      setResumeData(resume);
      document.title = resume.title;
    }
  };

  useEffect(() => {
    loadExistingResume();
  }, []);

  return (
    <div>
      <div className=' max-w-7xl mx-auto px-4 py-6'>
        <Link
          to={"/app"}
          className=' inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className=' size-4' /> Back to Dashboard
        </Link>
      </div>
      <div className=' max-w-7xl mx-auto px-4 pb-8'>
        <div className=' grid lg:grid-cols-2 gap-8'>
          {/* Left Panel- form */}
          <div className=' relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className=' bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/* Progress bar */}
              <hr className=' absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr
                className=' absolute top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000'
                style={{
                  width: `${
                    (activeSectionIndex * 100) / (sections.length - 1)
                  }%`,
                }}
              />
              {/* Section navigation */}
              <div className=' flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                {/* Left Side */}
                <div></div>

                {/* Right */}
                <div className=' flex items-center'>
                  {activeSectionIndex !== 0 && (
                    <button
                      onClick={() =>
                        setactiveSectionIndex((prevIndex) => {
                          Math.max(prevIndex - 1, 0);
                        })
                      }
                      className=' flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all'
                      disabled={activeSectionIndex === 0}>
                      <ChevronLeft className=' size-4' />
                      Previous
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setactiveSectionIndex((prevIndex) => {
                        Math.min(prevIndex + 1, sections.length - 1);
                      })
                    }
                    className={` flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-600 transition-all ${
                      activeSectionIndex === sections.length - 1 && "opacity-50"
                    }`}
                    disabled={activeSectionIndex === sections.length - 1}>
                    Next <ChevronRight className=' size-4' />
                  </button>
                </div>
              </div>
              {/* Form content */}
              <div className=' space-y-6'>
                {activeSection.id === "personal" && (
                  <PersonalInfoForm
                    data={resumeData.personal_info}
                    onChange={(data) => {
                      setResumeData((prev) => ({
                        ...prev,
                        personal_info: data,
                      }));
                    }}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Panel- Resume */}
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
