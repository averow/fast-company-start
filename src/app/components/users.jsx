import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { paginate } from "../utils/paginate";
import Pagination from "./pagination";
import GroupList from "./groupList";
import api from "../api";
import SearchStatus from "./searchStatus";
import UserTable from "./usersTable";
import _ from "lodash";
const Users = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [professions, setProfeshion] = useState();
    const [selectedProf, setSelectedProf] = useState();
    const [sortBy, setSortBy] = useState({
        iter: "name",
        order: "asc"
    }); /* состояние заголовка при  сортировке по алфовиту */

    const pageSize = 8;
    const [users, setUsers] = useState([]);
    useEffect(() => {
        api.users.fetchAll().then((data) => setUsers(data));
    }, []);

    const handleDelete = (userId) => {
        setUsers(users.filter((user) => user._id !== userId));
    };
    const handleToggleBookMark = (id) => {
        const newArray = users.map((user) => {
            if (user._id === id) {
                return { ...user, bookmark: !user.bookmark };
            }
            return user;
        });
        setUsers(newArray);
    };

    useEffect(() => {
        api.professions.fetchAll().then((data) => setProfeshion(data));
    }, [currentPage]);
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedProf]);

    const handleProfessionSelect = (item) => {
        setSelectedProf(item);
    };

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex);
    };
    const handelSort = (item) => {
        setSortBy(item);
    };
    if (users) {
        const filteredUsers = selectedProf
            ? users.filter(
                (user) =>
                    JSON.stringify(user.profession) ===
                    JSON.stringify(selectedProf)
            )
            : users;

        const count = filteredUsers.length;
        const sortedUsers = _.orderBy(
            filteredUsers,
            [sortBy.path],
            [sortBy.order]
        ); /* сортировка данных , импортировали лодаш ,а потом добавии метод orderBy, сортируем по алфавиту"asc"  по имени ,"desc" - в обратном порядке ,далее добавляем useState  */
        const usersCrop = paginate(sortedUsers, currentPage, pageSize);
        const clearFilter = () => {
            setSelectedProf();
        }; /* изменяет состояние всего компонента */
        return (
            <div className="d-flex">
                {professions && (
                    <div className="d-flex flex-column flex-shrink-0 p-3">
                        <GroupList
                            items={professions}
                            onItemSelect={handleProfessionSelect}
                            selectedItem={selectedProf}
                        />
                        <button
                            className="btn btn-secondary mt-2"
                            onClick={clearFilter}
                        >
                            {" "}
                            Очистить
                        </button>
                    </div>
                )}

                <div className="d-flex flex-column">
                    <SearchStatus length={count} />
                    {count > 0 && (
                        <UserTable
                            users={usersCrop}
                            onSort={handelSort}
                            selectedSort={sortBy}
                            onDelete={handleDelete}
                            onToggleBookMark={handleToggleBookMark}
                        />
                    )}
                    <div className="d-flex justify-content-center">
                        <Pagination
                            itemsCount={count}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        );
    }
    return "loading...";
};
Users.propTypes = {
    users: PropTypes.array
};

export default Users;
