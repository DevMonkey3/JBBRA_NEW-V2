
'use client';
import { Menu, Image, Card, Space, Row, Col, Input, Typography, List, Carousel, Button } from "antd";
import { getCdnUrl } from "@/config/cdn";

import './page.less';
import { LeftOutlined, RightOutlined, MenuOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // 引入 useRouter


export default function Header(props) {
    const { Text, Title } = Typography;
    const [current, setCurrent] = useState('Home');
    const router = useRouter(); // 初始化 useRouter
    const { currentIndex } = props;

    useEffect(() => {
        currentIndex && setCurrent(currentIndex);
    }, [currentIndex]);
    const clickMenu = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
        if (e.key === 'Seminar') {
            router.push('/seminar');
        }
    };

    const items = [
        {
            label: 'ホーム',
            key: 'Home',
        },
        {
            label: '選ばれる理由',
            key: 'whyChooseUse',
        },
        {
            label: 'サービス紹介',
            key: 'Service',
        }, {
            label: '導入実績',
            key: 'Track_Record',
        }, {
            label: '会社概要',
            key: 'Profile',
        },
        {
            label: 'セミナー',
            key: 'Seminar',
        },
        {
            label: 'ブログ',
            key: 'Blog',
        }, {
            label: 'お役立ち情報',
            key: 'Information_Related',
        }
    ];



    return (
        <>
            <div
                className="Home_page_topContext"
                style={{
                    // margin: '0 20px',
                    // display: 'flex',
                    // justifyContent: 'space-between',
                    // alignItems: 'center',
                    // // 防止父容器压缩
                    // minWidth: '100%',
                }}
            >
                <Row>
                    <Col span={4}>
                        <img
                            className="Home_page_jbbcIcon"
                            src={"https://bbc-images.sgp1.cdn.digitaloceanspaces.com/Jbbra%20realated%20photo/jbbra%20logo.png"}
                        />
                    </Col>
                    <Col span={20} style={{ alignItems: "right"  }}>
                        <div
                        style={{ alignItems: "right", display: "flex", justifyContent: "right" }}
                        >
                            <Menu
                                className="Home_page_menu"
                                onClick={clickMenu}
                                selectedKeys={current}
                                mode="horizontal"
                                style={{
                                    minWidth: 'fit-content', // 不随容器压缩
                                    lineHeight: '48px',
                                    border: 'none',
                                }}
                                items={items} />
                            <Button
                                size='large'
                                className="Home_page_menu_button1"
                                icon={<Image style={{ width: "20px", }} src={getCdnUrl("/home/notes.avif")} />}
                                onClick={() => clickMenu({ key: 'menu_button1' })}
                            >
                                お問い合わせ
                            </Button>
                            <Button
                                size='large'
                                className="Home_page_menu_button2"
                                icon={<MenuOutlined />}
                            >
                            </Button>
                        </div>
                    </Col>

                </Row>
                {/* <img
                    className="Home_page_jbbcIcon"
                    src="https://bbc-images.sgp1.cdn.digitaloceanspaces.com/Jbbra%20realated%20photo/jbbra%20logo.png"
                /> */}

            </div>
        </>
    );
}