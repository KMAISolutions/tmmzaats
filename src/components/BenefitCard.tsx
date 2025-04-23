
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-gray-800 to-black text-white">
        <div className="flex justify-center mb-3">
          {icon}
        </div>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <CardDescription className="text-center text-gray-600">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default BenefitCard;
