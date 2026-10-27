import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

type BackLinkProps = {
  title?: string;
  className?: string;
};

function BackLink({ title = "Back", className = "mb-6" }: BackLinkProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(-1);
  };

  return (
    <button
      onClick={handleNavigate}
      className={`inline-flex items-center gap-1.5 text-sm text-stone hover:text-ink transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {title}
    </button>
  );
}

export default BackLink;
