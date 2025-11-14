import { Loader2, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../configs/api";
import toast from "react-hot-toast";

const ProfessionalSummaryForm = ({ data, onChange, setResumeData }) => {
  const { token } = useSelector((state) => state.auth);
  const [isGenerating, setIsGenerating] = useState(false);

  const enhanceProfessionalSummary = async () => {
    if (!data) {
      return toast.error("Data required for enhancing");
    }

    const prompt = `Enhance my professional summary ${data}`;

    try {
      setIsGenerating(true);
      const { data } = await api.post(
        "/api/ai/enhance-pro-summary",
        { userContent: prompt },
        { headers: { Authorization: token } }
      );

      setResumeData((prev) => ({
        ...prev,
        professional_summary: data.enhancedContent.content,
      }));
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className=' space-y-4'>
      <div className=' flex items-center justify-between'>
        <div>
          <h3 className=' flex items-center gap-2 text-lg font-semibold text-gray-900'>
            Professional Summary
          </h3>
          <p className=' text-sm text-gray-500'>
            Add Summary for your resume here
          </p>
        </div>

        <button
          disabled={isGenerating}
          onClick={enhanceProfessionalSummary}
          className=' flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
          {isGenerating ? (
            <Loader2 className=' size-4 animate-spin' />
          ) : (
            <Sparkles className=' size-4' />
          )}
          {isGenerating ? "Generating.." : "AI enhance"}
        </button>
      </div>
      <div className=' mt-6'>
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          name=''
          id=''
          className=' w-full p-3 px-4 mt-2 border border-gray-500 text-sm rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500'
          placeholder='Write a compelling professional summary that highlights your key strengths and career objectives...'
        />
        <p className=' text-xs text-gray-500 max-w-4/5 mx-auto text-center'>
          Tip: Keep it concise(3-4 sentences) and focus on your most relevant
          achievements and skills
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
