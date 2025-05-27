import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { BASE_URL } from "@/utils/constants";
import { addNewComplaint } from "@/utils/userComplaintsSlice";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LodgeComplaint = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        BASE_URL + "/complaint/lodge",
        { title, description, category },
        { withCredentials: true }
      );
      dispatch(addNewComplaint(res.data));
      navigate("/employee/dashboard");
      alert("Complaint lodged successfully");
    } catch (err) {
      console.error("Error lodging complaint:", err);
      alert("Failed to lodge complaint. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] bg-muted px-4">
      <Card className="w-full max-w-xl shadow-lg">
        <CardHeader>
          <CardTitle>Lodge Complaint</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="complaintTitle">Complaint Title</Label>
              <Input
                id="complaintTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="complaintCategory">Complaint Category</Label>
              <Input
                id="complaintCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="complaintDescription">Complaint Description</Label>
              <Textarea
                id="complaintDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit">Submit Complaint</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LodgeComplaint;
