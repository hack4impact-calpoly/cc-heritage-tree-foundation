"use client";

import React, { useState, useEffect } from "react";
import { AlignJustify, ChevronRight, Trash2 } from "lucide-react";
import styles from "./messages.module.css";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Icon, useToast } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Stack,
  Divider,
  Tr,
  Th,
  Td,
  Text,
  Image,
  Flex,
  Avatar,
  Button,
  Box,
  Tfoot,
  Spinner,
} from "@chakra-ui/react";
import { CenterStyle } from "@/styles/AllStyle";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BrowserView, MobileView } from "react-device-detect";
import MessagePopUp from "@/components/MessagePopUp";
import DeleteMessagePopUp from "@/components/DeleteMessagePopUp";

function Messages() {
  const toast = useToast();
  const { isLoaded, isSignedIn, user } = useUser();
  const messagesPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentAdminPage, setCurrentAdminPage] = useState(1);
  const [messageID, setMessageID] = useState(-1);
  const [activeTab, setActiveTab] = useState("inbox");

  let role = null;
  if (isLoaded && user) {
    role = user.organizationMemberships?.[0]?.role;
  }
  const [isClient, setIsClient] = useState(false);
  const [openMessagePopUp, setOpenMessagePopUp] = useState(false);
  const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
  const [blurAmount, setBlurAmount] = useState("0px");
  const [messageProps, setMessageProps] = useState({
    date: "",
    adminName: "",
    messageContent: "",
    messageTitle: "",
    id: -1,
  });
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<any[]>([]);
  const [adminMessages, setAdminMessages] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<(typeof messages)[0] | null>(null);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);
  const totalAdminPages = Math.ceil(adminMessages.length / messagesPerPage);
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const indexOfAdminLastMessage = currentAdminPage * messagesPerPage;
  const indexOfAdminFirstMessage = indexOfAdminLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const currentAdminMessages = adminMessages.slice(indexOfAdminFirstMessage, indexOfAdminLastMessage);
  const isAdmin = role === "org:admin";
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchMessages = async () => {
    try {
      const response = await fetch("/api/messages");
      const data = await response.json();
      setMessages(data.reverse());
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfRead = (message: { readStatus: Array<{ userID: string; read: boolean }> }): boolean => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      return false; // Default to unread if no user email
    }

    const userStatus = message.readStatus.find((u) => u.userID === user?.primaryEmailAddress?.emailAddress);
    return userStatus?.read ?? false; // Return false if user status not found
  };

  useEffect(() => {
    if (messages.length > 0 && user) {
      const count = messages.filter((msg) => {
        const status = msg.readStatus?.find((u: any) => u.userID === user.primaryEmailAddress?.emailAddress);
        return !status?.read && checkIfRecipient(msg) && msg.from !== user?.fullName;
      }).length;
      setUnreadCount(count);
    }
  }, [messages, user]);

  const checkIfRecipient = (message: { to: Array<string> }) => {
    for (const recipient of message.to) {
      if (user?.primaryEmailAddress?.emailAddress == recipient) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    setIsClient(true);
    fetchMessages();
  }, []);

  useEffect(() => {
    setFilteredMessages(messages.filter((message) => checkIfRecipient(message)));
    setAdminMessages(messages.filter((message) => message.from == user?.fullName));
  }, [messages]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleAdminPageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentAdminPage(pageNumber);
    }
  };

  const toggleSelect = (id: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => (msg.id === id ? { ...msg, selected: !msg.selected } : msg)),
    );
  };

  const updateReadStatus = async (messageID: string) => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        console.error("No email address found for user");
        return;
      }

      const response = await fetch(`/api/messages/${messageID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "edit_read",
          userID: email,
          read: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update read status:", errorData);
        return;
      }

      const res = await response.json();
      console.log("Update successful:", res);

      // Wait a moment before refreshing to ensure update is complete
      setTimeout(() => {
        fetchMessages();
        console.log("Refreshed messages");
      }, 300);
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const deleteMessageFromTable = async () => {
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      console.error("No user email found");
      return;
    }

    if (activeTab === "inbox") {
      console.log("removing user from message:", messageID);
      try {
        const response = await fetch(`/api/messages/${messageID}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "remove_user",
            userEmail: userEmail,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to update message:", errorData);
          return;
        }

        const res = await response.json();
        console.log("Update successful:", res);

        // Refresh the table after a short delay
        setTimeout(() => {
          fetchMessages();
          console.log("refreshed table");
        }, 300);
      } catch (error) {
        console.error("Failed to update message:", error);
      }
    } else {
      try {
        const response = await fetch(`/api/messages/${messageID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Failed to delete message:", errorData);
          return;
        }

        const res = await response.json();
        console.log("Update successful:", res);

        // Refresh the table after a short delay
        setTimeout(() => {
          fetchMessages();
          console.log("refreshed table");
        }, 300);
      } catch (error) {
        console.error("Failed to update message:", error);
      }
    }
  };

  return (
    <div>
      {isClient ? (
        <>
          <BrowserView>
            {openDeletePopUp && (
              <Flex
                zIndex="1000"
                w={"100vw"}
                h={"100vh"}
                left={0}
                top={0}
                justifyContent={"center"}
                alignItems={"center"}
                position="absolute"
              >
                <DeleteMessagePopUp
                  closePopup={() => {
                    setOpenDeletePopUp(false);
                    setBlurAmount("0px");
                  }}
                  deleteMessage={() => {
                    deleteMessageFromTable();
                    setOpenDeletePopUp(false);
                    setBlurAmount("0px");
                    // add toast
                    toast({
                      render: () => (
                        <Box color="#596334" bg="white" p={5} borderRadius={20} boxShadow="md">
                          <Flex align="center">
                            <Icon as={CheckCircleIcon} color="#596334" boxSize={5} mr={4} />
                            <Flex direction={"column"}>
                              <Text fontWeight={"bold"}>Deleted!</Text>
                              <Text> Message has been successfully removed.</Text>
                            </Flex>
                          </Flex>
                        </Box>
                      ),
                    });
                  }}
                />
              </Flex>
            )}
            <Box filter="auto" blur={blurAmount} display="flex" justifyContent="center">
              <div className={styles.container}>
                <Text className={styles.header} fontSize={["24px", "30px", "38px"]} color="#333" fontWeight="600">
                  Messages
                </Text>
                <p className={styles.unread}>
                  {unreadCount} unread {unreadCount === 1 ? "announcement" : "announcements"}
                </p>

                <div className={styles.topBar}>
                  <div className={styles.tabContainer}>
                    <button
                      className={`${styles.tab} ${activeTab === "inbox" ? styles.activeTab : ""}`}
                      onClick={() => {
                        setActiveTab("inbox");
                        setCurrentPage(1);
                      }}
                    >
                      Inbox
                    </button>
                    {isAdmin && (
                      <button
                        className={`${styles.tab} ${activeTab === "sent" ? styles.activeTab : ""}`}
                        onClick={() => {
                          setActiveTab("sent");
                          setCurrentPage(1);
                        }}
                      >
                        Sent
                      </button>
                    )}
                  </div>
                  {isAdmin && (
                    <button className={styles.newMessageButton} onClick={() => router.push("/createAnnouncement")}>
                      New Message +
                    </button>
                  )}
                </div>

                {activeTab === "inbox" ? (
                  <div>
                    <Flex>
                      <Table className={styles.table}>
                        <Thead className={styles.tableHeader}>
                          <Tr className={styles.tableHeader}>
                            <Th>From</Th>
                            <Th>Subject Line</Th>
                            <Th>Date</Th>
                            <Th></Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {loading ? (
                            <Tr>
                              <Td colSpan={5}>
                                <Box {...CenterStyle} height="100%">
                                  <Spinner size="xl" thickness="4px" speed="0.65s" color="#596334" />
                                </Box>
                              </Td>
                            </Tr>
                          ) : (
                            filteredMessages.map((msg) => (
                              <Tr
                                key={msg._id}
                                className={
                                  checkIfRead(msg) || user?.fullName === msg.from
                                    ? styles.clickableRowIsRead
                                    : styles.clickableRowNotRead
                                }
                              >
                                <Td
                                  className={`${msg.selected ? styles.fadedText : ""}`}
                                  onClick={() => setSelectedMessage(msg)}
                                >
                                  <Flex className={styles.avatarContainer}>
                                    <Avatar name={msg.from} size="sm" bg="#596334" color="white" />
                                    {msg.from}
                                  </Flex>
                                </Td>
                                <Td className={msg.selected ? styles.fadedText : ""}>{msg.subject}</Td>
                                <Td className={msg.selected ? styles.fadedText : ""}>
                                  {new Date(msg.time).toLocaleDateString()}
                                </Td>
                                <Td>
                                  <Trash2
                                    onClick={() => {
                                      setOpenDeletePopUp(true);
                                      setBlurAmount("3px");
                                      setMessageID(msg._id);
                                    }}
                                  />
                                </Td>
                                <Td>
                                  <ChevronRight
                                    onClick={() => {
                                      setOpenMessagePopUp(!openMessagePopUp);
                                      setMessageProps({
                                        date: new Date(msg.time).toLocaleDateString(),
                                        adminName: msg.from,
                                        messageContent: msg.message,
                                        messageTitle: msg.subject,
                                        id: msg._id,
                                      });
                                      updateReadStatus(msg._id);
                                    }}
                                  />
                                </Td>
                              </Tr>
                            ))
                          )}

                          {/* Used to create whitespace on the last  */}
                          {Array.from({ length: 7 - currentMessages.length }).map((_, i) => (
                            <tr key={`empty-${i}`} style={{ height: "55px" }}>
                              <td colSpan={5} />
                            </tr>
                          ))}
                        </Tbody>

                        {/* Page Controls */}
                        <Tfoot>
                          <Tr>
                            <Td colSpan={5}>
                              <Box className={styles.pageControls}>
                                <Button
                                  className={styles.pageButton}
                                  onClick={() => handlePageChange(currentPage - 1)}
                                  disabled={currentPage === 1}
                                >
                                  Previous
                                </Button>

                                {Array.from({ length: totalPages }, (_, index) => (
                                  <Button
                                    key={index + 1}
                                    className={currentPage === index + 1 ? styles.activePage : styles.pageButton}
                                    onClick={() => handlePageChange(index + 1)}
                                  >
                                    {index + 1}
                                  </Button>
                                ))}

                                <Button
                                  className={styles.pageButton}
                                  onClick={() => handlePageChange(currentPage + 1)}
                                  disabled={currentPage === totalPages}
                                >
                                  Next
                                </Button>
                              </Box>
                            </Td>
                          </Tr>
                        </Tfoot>
                      </Table>
                      {openMessagePopUp === true ? (
                        <MessagePopUp
                          date={messageProps.date}
                          messageTitle={messageProps.messageTitle}
                          adminName={messageProps.adminName}
                          messageContent={messageProps.messageContent}
                          id={messageProps.id}
                        />
                      ) : (
                        <></>
                      )}
                    </Flex>
                  </div>
                ) : (
                  <div>
                    <Flex>
                      <Table className={styles.table}>
                        <Thead className={styles.tableHeader}>
                          <Tr className={styles.tableHeader}>
                            <Th>From</Th>
                            <Th>Subject Line</Th>
                            <Th>Date</Th>
                            <Th></Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {loading ? (
                            <Tr>
                              <Td colSpan={5}>
                                <Box {...CenterStyle} height="100%">
                                  <Spinner size="xl" thickness="4px" speed="0.65s" color="#596334" />
                                </Box>
                              </Td>
                            </Tr>
                          ) : (
                            adminMessages.map((msg) => (
                              <Tr key={msg._id} className={styles.clickableRowNotRead}>
                                <Td
                                  className={`${msg.selected ? styles.fadedText : ""}`}
                                  onClick={() => setSelectedMessage(msg)}
                                >
                                  <Flex className={styles.avatarContainer}>
                                    <Avatar name={msg.from} size="sm" bg="#596334" color="white" />
                                    {msg.from}
                                  </Flex>
                                </Td>
                                <Td className={msg.selected ? styles.fadedText : ""}>{msg.subject}</Td>
                                <Td className={msg.selected ? styles.fadedText : ""}>
                                  {new Date(msg.time).toLocaleDateString()}
                                </Td>
                                <Td>
                                  <Trash2
                                    onClick={() => {
                                      setOpenDeletePopUp(true);
                                      setBlurAmount("3px");
                                      setMessageID(msg._id);
                                    }}
                                  />
                                </Td>
                                <Td>
                                  <ChevronRight
                                    onClick={() => {
                                      setOpenMessagePopUp(!openMessagePopUp);
                                      setMessageProps({
                                        date: new Date(msg.time).toLocaleDateString(),
                                        adminName: msg.from,
                                        messageContent: msg.message,
                                        messageTitle: msg.subject,
                                        id: msg._id,
                                      });
                                    }}
                                  />
                                </Td>
                              </Tr>
                            ))
                          )}

                          {/* Used to create whitespace on the last  */}
                          {Array.from({ length: 7 - currentAdminMessages.length }).map((_, i) => (
                            <tr key={`empty-${i}`} style={{ height: "55px" }}>
                              <td colSpan={5} />
                            </tr>
                          ))}
                        </Tbody>

                        {/* Page Controls */}
                        <Tfoot>
                          <Tr>
                            <Td colSpan={5}>
                              <Box className={styles.pageControls}>
                                <Button
                                  className={styles.pageButton}
                                  onClick={() => handleAdminPageChange(currentAdminPage - 1)}
                                  disabled={currentAdminPage === 1}
                                >
                                  Previous
                                </Button>

                                {Array.from({ length: totalAdminPages }, (_, index) => (
                                  <Button
                                    key={index + 1}
                                    className={currentAdminPage === index + 1 ? styles.activePage : styles.pageButton}
                                    onClick={() => handleAdminPageChange(index + 1)}
                                  >
                                    {index + 1}
                                  </Button>
                                ))}

                                <Button
                                  className={styles.pageButton}
                                  onClick={() => handleAdminPageChange(currentAdminPage + 1)}
                                  disabled={currentAdminPage === totalAdminPages}
                                >
                                  Next
                                </Button>
                              </Box>
                            </Td>
                          </Tr>
                        </Tfoot>
                      </Table>
                      {openMessagePopUp === true ? (
                        <MessagePopUp
                          date={messageProps.date}
                          messageTitle={messageProps.messageTitle}
                          adminName={messageProps.adminName}
                          messageContent={messageProps.messageContent}
                          id={messageProps.id}
                        />
                      ) : (
                        <></>
                      )}
                    </Flex>
                  </div>
                )}
              </div>
            </Box>
          </BrowserView>

          <MobileView>
            <div>
              <div style={{ overflowX: "hidden" }}>
                <div>
                  <div>
                    <div
                      style={{
                        position: "absolute",
                        marginLeft: "20px",
                        marginTop: "15px",
                      }}
                    >
                      <AlignJustify></AlignJustify>
                    </div>
                    {/* add tree icon */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "50px",
                      }}
                    >
                      <Image src="./logo1.png" alt="tree icon" height={"50px"}></Image>
                    </div>

                    <button
                      className={`${styles.tab} ${activeTab === "inbox" ? styles.activeTab : ""}`}
                      style={{ marginTop: "20px", marginLeft: "10px" }}
                      onClick={() => {
                        setActiveTab("inbox");
                        setCurrentPage(1);
                      }}
                    >
                      Inbox
                    </button>
                    {isAdmin && (
                      <button
                        className={`${styles.tab} ${activeTab === "sent" ? styles.activeTab : ""}`}
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                          setActiveTab("sent");
                          setCurrentPage(1);
                        }}
                      >
                        Sent
                      </button>
                    )}
                  </div>
                  {isAdmin && (
                    <button className={styles.newMessageButton} onClick={() => router.push("/createAnnouncement")}>
                      New Message +
                    </button>
                  )}
                </div>

                {activeTab === "inbox" ? (
                  <>
                    <Stack backgroundColor={"white"} marginTop={7} borderRadius={10} padding={5} margin={3}>
                      {currentMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={msg.selected ? styles.fadedRow : ""}
                          onClick={() => toggleSelect(msg.id)}
                        >
                          <div className={msg.selected ? styles.fadedText : ""}>
                            <Flex alignItems={"center"}>
                              <Avatar name={msg.sender} size="md" bg="#596334" color="white" />
                              <div style={{ padding: "10px" }}>
                                <Flex justify="space-between">
                                  {msg.sender}
                                  <Text className={msg.selected ? styles.fadedText : ""}>{msg.date}</Text>
                                </Flex>
                                <Text
                                  style={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    maxWidth: "100%",
                                  }}
                                  className={msg.selected ? styles.fadedText : ""}
                                >
                                  {msg.message}
                                </Text>
                              </div>
                            </Flex>
                          </div>
                          <div style={{ marginTop: "5px" }}>
                            <Divider />
                          </div>
                        </div>
                      ))}
                    </Stack>

                    {/* Pagination Controls */}
                    <Box className={styles.pageControls} style={{ marginBottom: "70px" }}>
                      <Button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                      {Array.from({ length: totalPages }, (_, index) => (
                        <Button
                          key={index + 1}
                          className={currentPage === index + 1 ? styles.activePage : styles.pageButton}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Button>
                      ))}

                      <Button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </Box>
                  </>
                ) : (
                  <p className={styles.sentMessage}>Sent messages here.</p>
                )}
              </div>
            </div>
          </MobileView>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Messages;
