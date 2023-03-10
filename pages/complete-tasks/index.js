import { useQuery } from "@tanstack/react-query";
import { Spinner } from "flowbite-react";
import Router, { useRouter } from "next/router";
import React, { useContext } from "react";
import CompleteTaskItem from "../../Components/CompleteTaskItem/CompleteTaskItem";
import TaskItem from "../../Components/TaskItem/TaskItem";
import { AuthContext } from "../../Contexts/AuthProvider/AuthProvider";

const CompleteTasks = () => {
  const { user, loading } = useContext(AuthContext);
  const {
    data = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [user?.email],
    queryFn: () =>
      fetch(
        `https://my-tasks-server-chi.vercel.app/tasks?email=${
          user?.email
        }&state=${true}`
      ).then((res) => res.json()),
  });
  if (!user) {
    refetch();
  }
  const router = useRouter();
  if (!user && !loading) {
    router.push("/login");
  }
  const handleInComplete = (id) => {
    fetch(
      `https://my-tasks-server-chi.vercel.app/task-complete?id=${id}&state=false`,
      {
        method: "PUT",
      }
    )
      .then((res) => {
        refetch();
      })

      .catch((er) => {
        console.log(er);
      });
  };
  return (
    <div className="bg-gray-900 py-12 h-screen">
      <div className="container mx-auto">
        {data?.map((task, i) => (
          <CompleteTaskItem
            key={task._id}
            task={task}
            index={i}
            handleInComplete={handleInComplete}
            refetch={refetch}
          ></CompleteTaskItem>
        ))}
        {data.length === 0 && (
          <div className="text-white bg-gray-800 py-5">
            <h2 className="text-xl text-center">No Task Completed yet</h2>
          </div>
        )}
        {isLoading && (
          <div className="h-screen flex justify-center ">
            <Spinner></Spinner>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompleteTasks;
