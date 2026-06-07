import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import axios from "axios";
import { io } from "socket.io-client";

import {
  Activity,
  Plus,
  Edit2,
  UserCheck,
  AlertCircle,
  Search,
  Clock3,
} from "lucide-react";

const BASE_URL =
  "http://192.168.100.5:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

function ActivityLog() {
  const [activities, setActivities] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [filter, setFilter] =
    useState("ALL");

  const [socket, setSocket] =
    useState(null);

  const [search, setSearch] =
    useState("");

  /* =========================================
     FETCH ACTIVITIES
  ========================================= */
  const fetchActivities =
    useCallback(async () => {
      try {
        setLoading(true);

        const res = await api.get(
          "/api/activities"
        );

        let data = [];

        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (
          Array.isArray(res.data.data)
        ) {
          data = res.data.data;
        }

        /* =========================================
           REMOVE DELETED MEMBERS FROM UI
        ========================================= */
        const filteredDeleted =
          data.filter(
            (item) =>
              item.action !== "DELETE"
          );

        const sorted = [
          ...filteredDeleted,
        ].sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(a.createdAt)
        );

        setActivities(sorted);
      } catch (error) {
        console.log(
          "FETCH ACTIVITIES ERROR:",
          error
        );

        setActivities([]);
      } finally {
        setLoading(false);
      }
    }, []);

  /* =========================================
     SOCKET CONNECTION
  ========================================= */
  useEffect(() => {
    fetchActivities();

    const newSocket = io(BASE_URL, {
      transports: [
        "websocket",
        "polling",
      ],
      reconnection: true,
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log(
        "🟢 Activity Log Connected"
      );
    });

    /* =========================================
       MEMBER ACTIVITY
    ========================================= */
    newSocket.on(
      "member-activity",
      (data) => {
        if (
          data?.activity?.action ===
          "DELETE"
        ) {
          return;
        }

        setActivities((prev) => [
          data.activity,
          ...prev,
        ]);
      }
    );

    /* =========================================
       ATTENDANCE ACTIVITY
    ========================================= */
    newSocket.on(
      "new-attendance",
      (data) => {
        const attendanceActivity =
          {
            _id: `${data._id}-${Date.now()}`,
            action: "ATTENDANCE",
            entityType:
              "ATTENDANCE",
            entityId: data._id,
            entityName:
              data.name,
            description: `${data.name} checked in for ${data.service}`,
            timestamp: new Date(),
            createdAt: new Date(),
            service:
              data.service,
          };

        setActivities((prev) => [
          attendanceActivity,
          ...prev,
        ]);
      }
    );

    newSocket.on(
      "disconnect",
      () => {
        console.log(
          "🔴 Socket disconnected"
        );
      }
    );

    return () => {
      newSocket.disconnect();
    };
  }, [fetchActivities]);

  /* =========================================
     FILTER ACTIVITIES
  ========================================= */
  const filteredActivities =
    useMemo(() => {
      return activities.filter(
        (activity) => {
          const matchesSearch =
            activity?.entityName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||
            activity?.description
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          if (
            filter === "ALL"
          ) {
            return matchesSearch;
          }

          if (
            filter === "MEMBER"
          ) {
            return (
              activity.entityType ===
                "MEMBER" &&
              matchesSearch
            );
          }

          if (
            filter ===
            "ATTENDANCE"
          ) {
            return (
              (activity.entityType ===
                "ATTENDANCE" ||
                activity.action ===
                  "ATTENDANCE") &&
              matchesSearch
            );
          }

          if (
            filter === "ADD"
          ) {
            return (
              activity.action ===
                "ADD" &&
              matchesSearch
            );
          }

          if (
            filter ===
            "UPDATE"
          ) {
            return (
              activity.action ===
                "UPDATE" &&
              matchesSearch
            );
          }

          return matchesSearch;
        }
      );
    }, [
      activities,
      filter,
      search,
    ]);

  /* =========================================
     ACTION ICON
  ========================================= */
  const getActionIcon = (
    action
  ) => {
    switch (action) {
      case "ADD":
        return (
          <Plus
            className="text-green-400"
            size={18}
          />
        );

      case "UPDATE":
        return (
          <Edit2
            className="text-blue-400"
            size={18}
          />
        );

      case "ATTENDANCE":
        return (
          <UserCheck
            className="text-purple-400"
            size={18}
          />
        );

      default:
        return (
          <Activity
            className="text-zinc-400"
            size={18}
          />
        );
    }
  };

  /* =========================================
     ACTION COLOR
  ========================================= */
  const getActionColor = (
    action
  ) => {
    switch (action) {
      case "ADD":
        return "from-green-600/20 to-green-900/10 border-green-500/20";

      case "UPDATE":
        return "from-blue-600/20 to-blue-900/10 border-blue-500/20";

      case "ATTENDANCE":
        return "from-purple-600/20 to-purple-900/10 border-purple-500/20";

      default:
        return "from-zinc-800/20 to-zinc-900/10 border-zinc-700/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-black text-white p-4 md:p-8">
      {/* HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
            <Activity
              className="text-blue-400"
              size={32}
            />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-black">
              Activity Log
            </h1>

            <p className="text-zinc-400 mt-1">
              Real-time member and
              attendance activities
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 mb-8">
        <div className="flex flex-col xl:flex-row gap-4">
          {/* SEARCH */}
          <div className="flex items-center flex-1 bg-black/40 border border-zinc-800 rounded-2xl px-4">
            <Search
              size={18}
              className="text-zinc-500"
            />

            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full p-4 bg-transparent outline-none"
            />
          </div>

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap gap-3">
            {[
              "ALL",
              "MEMBER",
              "ATTENDANCE",
              "ADD",
              "UPDATE",
            ].map(
              (
                filterOption
              ) => (
                <button
                  key={
                    filterOption
                  }
                  onClick={() =>
                    setFilter(
                      filterOption
                    )
                  }
                  className={`px-5 py-3 rounded-2xl font-semibold transition-all ${
                    filter ===
                    filterOption
                      ? "bg-blue-600 shadow-lg shadow-blue-600/30"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  {
                    filterOption
                  }
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* ACTIVITIES */}
      <div className="space-y-5">
        {loading ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 text-center">
            <p className="text-zinc-400">
              Loading activities...
            </p>
          </div>
        ) : filteredActivities.length ===
          0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 text-center">
            <AlertCircle
              className="mx-auto mb-4 text-zinc-500"
              size={40}
            />

            <p className="text-zinc-500">
              No activities found
            </p>
          </div>
        ) : (
          filteredActivities.map(
            (
              activity,
              index
            ) => (
              <div
                key={
                  activity._id ||
                  index
                }
                className={`bg-gradient-to-r ${getActionColor(
                  activity.action
                )} border rounded-3xl p-6 backdrop-blur-xl transition-all hover:scale-[1.01]`}
              >
                {/* TOP */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-black/30 flex items-center justify-center">
                      {getActionIcon(
                        activity.action
                      )}
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">
                        {
                          activity.entityName
                        }
                      </h2>

                      <p className="text-zinc-300 mt-1">
                        {activity.description}
                      </p>

                      {activity.service && (
                        <span className="inline-block mt-3 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                          {
                            activity.service
                          }
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="bg-black/30 px-3 py-1 rounded-full text-xs font-semibold">
                      {
                        activity.action
                      }
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400 text-xs mt-3">
                      <Clock3
                        size={12}
                      />

                      {new Date(
                        activity.timestamp ||
                          activity.createdAt
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* CHANGES */}
                {activity.changes &&
                  Object.keys(
                    activity.changes
                  ).length >
                    0 && (
                    <div className="mt-5 bg-black/20 rounded-2xl p-4">
                      <p className="text-sm text-zinc-400 font-semibold mb-3">
                        Updated Fields
                      </p>

                      <div className="space-y-2">
                        {Object.entries(
                          activity.changes
                        ).map(
                          ([
                            key,
                            value,
                          ]) => (
                            <div
                              key={
                                key
                              }
                              className="flex justify-between text-sm"
                            >
                              <span className="capitalize text-zinc-300">
                                {
                                  key
                                }
                              </span>

                              <span>
                                <span className="text-red-400">
                                  {
                                    value.from
                                  }
                                </span>

                                {" → "}

                                <span className="text-green-400">
                                  {
                                    value.to
                                  }
                                </span>
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )
          )
        )}
      </div>

      {/* REALTIME */}
      <div className="mt-8 flex items-center gap-3 text-sm text-zinc-400">
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />

        Real-time activity tracking
        enabled
      </div>
    </div>
  );
}

export default ActivityLog;