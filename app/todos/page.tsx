"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Calendar,
  ListTodo,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Navigation from "@/components/Navigation";
import { createTodoSchema } from "@/types/todo";

type FilterType = "all" | "active" | "completed";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export default function TodosPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ title: string }>({
    resolver: zodResolver(createTodoSchema.pick({ title: true })),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
  } = useForm<{ title: string }>({
    resolver: zodResolver(createTodoSchema.pick({ title: true })),
  });

  // Load todos
  useEffect(() => {
    if (user) {
      loadTodos();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTodos = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add todo
  const onSubmit = async (data: { title: string }) => {
    try {
      const { error } = await supabase.from("todos").insert([
        {
          title: data.title,
          completed: false,
          user_id: user?.id,
        },
      ]);

      if (error) throw error;

      reset();
      setIsAddingTodo(false);
      loadTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Edit todo
  const onEditSubmit = async (data: { title: string }) => {
    if (!editingTodo) return;

    try {
      const { error } = await supabase
        .from("todos")
        .update({ title: data.title, updated_at: new Date().toISOString() })
        .eq("id", editingTodo.id);

      if (error) throw error;

      resetEdit();
      setEditingTodo(null);
      loadTodos();
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  // Toggle completion
  const toggleTodo = async (todo: Todo) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({
          completed: !todo.completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", todo.id);

      if (error) throw error;
      loadTodos();
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async () => {
    if (!deletingTodo) return;

    try {
      const { error } = await supabase
        .from("todos")
        .delete()
        .eq("id", deletingTodo.id);

      if (error) throw error;

      setDeletingTodo(null);
      loadTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Open edit dialog
  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setValueEdit("title", todo.title);
  };

  // Filter todos
  const filteredTodos = todos.filter(todo => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed);

    const matchesSearch = todo.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Get filter counts
  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center pt-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading todos...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
            <p className="text-gray-600">
              Manage your tasks and stay organized
            </p>
          </div>

          {/* Add Todo Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              {!isAddingTodo ? (
                <button
                  onClick={() => setIsAddingTodo(true)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add new todo
                </button>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <input
                      {...register("title")}
                      type="text"
                      placeholder="What needs to be done?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isSubmitting ? "Adding..." : "Add Todo"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingTodo(false);
                        reset();
                      }}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search todos..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                      filter === "all"
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    All ({todos.length})
                  </button>
                  <button
                    onClick={() => setFilter("active")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                      filter === "active"
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Active ({activeTodos})
                  </button>
                  <button
                    onClick={() => setFilter("completed")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                      filter === "completed"
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Completed ({completedTodos})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Todos List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {filteredTodos.length === 0 ? (
              <div className="p-12 text-center">
                <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || filter !== "all"
                    ? "No todos found"
                    : "No todos yet"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter"
                    : "Add your first todo to get started"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredTodos.map(todo => (
                  <div
                    key={todo.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Completion Toggle */}
                      <button
                        onClick={() => toggleTodo(todo)}
                        className={`mt-1 cursor-pointer ${
                          todo.completed
                            ? "text-green-600"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>

                      {/* Todo Content */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-lg font-medium ${
                            todo.completed
                              ? "text-gray-500 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {todo.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Created {formatDate(todo.created_at)}
                          </div>
                          {todo.updated_at !== todo.created_at && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Updated {formatDate(todo.updated_at)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditDialog(todo)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit todo"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingTodo(todo)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete todo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Edit Dialog */}
        {editingTodo && (
          <div className="fixed inset-0 backdrop-blur-lg bg-white bg-opacity-5 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Edit Todo
                </h3>
                <form
                  onSubmit={handleSubmitEdit(onEditSubmit)}
                  className="space-y-4"
                >
                  <div>
                    <input
                      {...registerEdit("title")}
                      type="text"
                      placeholder="Todo title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      autoFocus
                    />
                    {editErrors.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {editErrors.title.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isEditSubmitting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isEditSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTodo(null);
                        resetEdit();
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deletingTodo && (
          <div className="fixed inset-0 backdrop-blur-lg bg-white bg-opacity-5 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Delete Todo
                  </h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete &quot;
                  <strong>{deletingTodo.title}</strong>&quot;? This action
                  cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={deleteTodo}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeletingTodo(null)}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
