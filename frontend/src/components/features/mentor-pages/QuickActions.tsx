import React from "react";
import { useRouter } from "next/router";
import { Button } from "../../../design/system/button";
import { Calendar, Users, Star, MessageSquare } from "lucide-react";

const QuickActions: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
      <Button 
        onClick={() => router.push("/mentor/sessions")}
        className="w-full text-white bg-blue-600 hover:bg-blue-700 py-3 sm:w-auto sm:py-2"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Manage Sessions
      </Button>
      <Button 
        onClick={() => router.push("/mentor/availability")}
        className="w-full text-white bg-green-600 hover:bg-green-700 py-3 sm:w-auto sm:py-2"
      >
        <Calendar className="w-4 h-4 mr-2" />
        Manage Availability
      </Button>
      <Button 
        onClick={() => router.push("/mentor/students")}
        variant="outline" 
        className="w-full py-3 sm:w-auto sm:py-2"
      >
        <Users className="w-4 h-4 mr-2" />
        View All Students
      </Button>
      <Button variant="outline" className="w-full py-3 sm:w-auto sm:py-2">
        <Star className="w-4 h-4 mr-2" />
        View Ratings
      </Button>
    </div>
  );
};

export default QuickActions;
