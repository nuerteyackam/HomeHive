--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: joel
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(255) NOT NULL,
    details text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activity_logs OWNER TO joel;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: joel
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO joel;

--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: joel
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: enquiries; Type: TABLE; Schema: public; Owner: joel
--

CREATE TABLE public.enquiries (
    id integer NOT NULL,
    property_id integer,
    user_id integer,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    phone character varying(20),
    message text NOT NULL,
    status character varying(20) DEFAULT 'new'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.enquiries OWNER TO joel;

--
-- Name: enquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: joel
--

CREATE SEQUENCE public.enquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enquiries_id_seq OWNER TO joel;

--
-- Name: enquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: joel
--

ALTER SEQUENCE public.enquiries_id_seq OWNED BY public.enquiries.id;


--
-- Name: investment_analyses; Type: TABLE; Schema: public; Owner: joel
--

CREATE TABLE public.investment_analyses (
    id integer NOT NULL,
    user_id integer,
    purchase_price numeric(12,2) NOT NULL,
    down_payment numeric(12,2) NOT NULL,
    interest_rate numeric(5,2) NOT NULL,
    loan_term integer NOT NULL,
    rent numeric(12,2) NOT NULL,
    tax numeric(12,2) NOT NULL,
    insurance numeric(12,2) NOT NULL,
    appreciation_rate numeric(5,2) NOT NULL,
    roi numeric(10,2) NOT NULL,
    cash_flow numeric(12,2) NOT NULL,
    rental_yield numeric(10,2) NOT NULL,
    break_even_point numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.investment_analyses OWNER TO joel;

--
-- Name: investment_analyses_id_seq; Type: SEQUENCE; Schema: public; Owner: joel
--

CREATE SEQUENCE public.investment_analyses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.investment_analyses_id_seq OWNER TO joel;

--
-- Name: investment_analyses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: joel
--

ALTER SEQUENCE public.investment_analyses_id_seq OWNED BY public.investment_analyses.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: joel
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    bedrooms integer NOT NULL,
    bathrooms numeric(3,1) NOT NULL,
    square_feet integer NOT NULL,
    property_type character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    address character varying(200) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    zip_code character varying(20) NOT NULL,
    latitude numeric(10,8),
    longitude numeric(11,8),
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    verification_status character varying(20) DEFAULT 'pending'::character varying
);


ALTER TABLE public.properties OWNER TO joel;

--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: joel
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.properties_id_seq OWNER TO joel;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: joel
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: property_images; Type: TABLE; Schema: public; Owner: joel
--

CREATE TABLE public.property_images (
    id integer NOT NULL,
    property_id integer,
    image_url character varying(255) NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.property_images OWNER TO joel;

--
-- Name: property_images_id_seq; Type: SEQUENCE; Schema: public; Owner: joel
--

CREATE SEQUENCE public.property_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.property_images_id_seq OWNER TO joel;

--
-- Name: property_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: joel
--

ALTER SEQUENCE public.property_images_id_seq OWNED BY public.property_images.id;


--
-- Name: saved_properties; Type: TABLE; Schema: public; Owner: joel
--

CREATE TABLE public.saved_properties (
    id integer NOT NULL,
    user_id integer,
    property_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.saved_properties OWNER TO joel;

--
-- Name: saved_properties_id_seq; Type: SEQUENCE; Schema: public; Owner: joel
--

CREATE SEQUENCE public.saved_properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.saved_properties_id_seq OWNER TO joel;

--
-- Name: saved_properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: joel
--

ALTER SEQUENCE public.saved_properties_id_seq OWNED BY public.saved_properties.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: joel
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO joel;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: joel
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO joel;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: joel
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: enquiries id; Type: DEFAULT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.enquiries ALTER COLUMN id SET DEFAULT nextval('public.enquiries_id_seq'::regclass);


--
-- Name: investment_analyses id; Type: DEFAULT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.investment_analyses ALTER COLUMN id SET DEFAULT nextval('public.investment_analyses_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: property_images id; Type: DEFAULT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.property_images ALTER COLUMN id SET DEFAULT nextval('public.property_images_id_seq'::regclass);


--
-- Name: saved_properties id; Type: DEFAULT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.saved_properties ALTER COLUMN id SET DEFAULT nextval('public.saved_properties_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: joel
--

COPY public.activity_logs (id, user_id, action, details, created_at) FROM stdin;
1	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 15:16:46.183686+00
2	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 15:16:46.551686+00
3	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 15:18:57.191293+00
4	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 15:18:57.539095+00
5	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:44:20.484452+00
6	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:44:20.917969+00
7	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:44:27.131332+00
8	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:44:27.357837+00
9	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:44:39.265383+00
10	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:44:39.774883+00
11	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:46:00.550666+00
12	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:46:37.555954+00
13	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:46:37.701448+00
14	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:49:48.613888+00
15	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:49:48.68574+00
16	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:49:53.448969+00
17	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:49:54.000886+00
18	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:52:19.066067+00
19	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:52:19.585807+00
20	3	UPDATE_PROPERTY_STATUS	Updated property 4: verification status to verified	2025-05-02 17:52:34.482496+00
21	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:52:34.836104+00
22	3	UPDATE_PROPERTY_STATUS	Updated property 3: verification status to verified	2025-05-02 17:52:41.053053+00
23	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:52:41.390573+00
24	3	UPDATE_PROPERTY_STATUS	Updated property 2: verification status to verified	2025-05-02 17:52:47.266101+00
25	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:52:47.606092+00
26	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:52:54.493708+00
27	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:52:54.980681+00
28	3	CREATE_USER	Created new user: mike@gmail.com with role: user	2025-05-02 17:53:44.662208+00
29	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:53:45.008481+00
30	3	DELETE_USER	Deleted user: mike@gmail.com	2025-05-02 17:53:52.331225+00
31	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:53:52.664894+00
32	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:53:55.544584+00
33	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:53:56.287249+00
34	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:56:01.203488+00
35	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 17:56:01.661899+00
36	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:56:05.460085+00
37	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 17:56:05.814518+00
38	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:00:27.857913+00
39	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:00:27.892967+00
40	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 18:05:16.713861+00
41	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 18:05:17.290335+00
42	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:05:18.294495+00
43	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:05:18.596329+00
44	3	DELETE_PROPERTY	Admin deleted property: Property 3 (ID: 4) listed by ackamjoel@gmail.com	2025-05-02 18:05:30.733454+00
45	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:05:31.07611+00
46	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:12:31.114533+00
47	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:12:31.686899+00
48	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 18:13:05.543436+00
49	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 18:13:05.921805+00
50	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:13:12.569089+00
51	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:13:12.909186+00
52	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 18:14:12.019713+00
53	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 18:14:12.358784+00
54	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:14:19.500643+00
55	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:14:19.829317+00
56	3	UPDATE_PROPERTY_STATUS	Updated property 3: verification status to pending	2025-05-02 18:14:30.754582+00
57	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:14:31.115318+00
58	3	UPDATE_PROPERTY_STATUS	Updated property 3: verification status to verified	2025-05-02 18:14:37.569126+00
59	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:14:37.903021+00
60	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:18:21.199307+00
61	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 18:18:21.556579+00
62	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 19:24:31.903348+00
63	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 19:24:32.270263+00
64	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 19:24:47.997519+00
65	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-02 19:24:48.337975+00
66	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 19:24:50.48714+00
67	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-02 19:24:50.830835+00
68	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-03 00:37:44.458465+00
69	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-03 00:37:44.820701+00
70	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-03 19:14:33.25714+00
71	3	VIEW_ALL_PROPERTIES	Admin viewed all properties with details	2025-05-03 19:14:33.621785+00
72	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-03 19:14:40.100452+00
73	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-03 19:14:40.357102+00
74	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-03 19:21:02.876343+00
75	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-03 19:21:03.114981+00
76	3	DELETE_USER	Deleted user: mike@gmail.com	2025-05-03 19:21:14.163927+00
77	3	VIEW_ALL_USERS	Admin viewed all users	2025-05-03 19:21:14.508144+00
\.


--
-- Data for Name: enquiries; Type: TABLE DATA; Schema: public; Owner: joel
--

COPY public.enquiries (id, property_id, user_id, name, email, phone, message, status, created_at) FROM stdin;
2	3	\N	joe;	ackamjay@gmail.com	0561452347	i am interested in this	new	2025-05-01 19:48:59.165112
1	2	\N	Joana	ackamjay@gmail.com	0561452347	i want to buy this	responded	2025-04-28 18:21:20.265665
\.


--
-- Data for Name: investment_analyses; Type: TABLE DATA; Schema: public; Owner: joel
--

COPY public.investment_analyses (id, user_id, purchase_price, down_payment, interest_rate, loan_term, rent, tax, insurance, appreciation_rate, roi, cash_flow, rental_yield, break_even_point, created_at) FROM stdin;
2	1	3000000.00	2000.00	10.00	5	2000.00	998.00	7.00	0.00	24.26	1212997.80	0.80	49.46	2025-05-02 12:19:05.403151
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: joel
--

COPY public.properties (id, title, description, price, bedrooms, bathrooms, square_feet, property_type, status, address, city, state, zip_code, latitude, longitude, user_id, created_at, verification_status) FROM stdin;
2	Agora hills lodge	One of the finest houses in Agora hills	2000000.00	5	5.0	2998	Single Family	For Sale	Mantse Ayiku Street	Accra	Spintex	00233	0.00000300	0.00000500	1	2025-04-28 18:18:13.92527	verified
3	Forest lodge	Beautiful house in the woods	300000.00	3	2.0	999	Single Family	For Sale	Lomotey Ngarlor Street	Tema	Sakumono	0000	0.23000000	0.33999800	1	2025-04-28 18:52:24.541286	verified
\.


--
-- Data for Name: property_images; Type: TABLE DATA; Schema: public; Owner: joel
--

COPY public.property_images (id, property_id, image_url, is_primary, created_at) FROM stdin;
2	2	https://images.unsplash.com/photo-1570129477492-45c003edd2be	t	2025-04-28 18:18:13.932961
4	3	https://plus.unsplash.com/premium_photo-1733514433422-413d9a3db3e0	t	2025-04-28 18:53:04.739238
\.


--
-- Data for Name: saved_properties; Type: TABLE DATA; Schema: public; Owner: joel
--

COPY public.saved_properties (id, user_id, property_id, created_at) FROM stdin;
3	1	3	2025-04-28 20:24:46.161546
4	2	2	2025-05-01 19:25:40.845451
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: joel
--

COPY public.users (id, name, email, password, role, created_at, is_active) FROM stdin;
1	Joel Nuertey	ackamjoel@gmail.com	$2b$10$ntSoIRHREjY10X0e8.qzDeNSNgm7XXtO2eNYE1KtMeuLiz/SbQHuW	agent	2025-04-24 11:19:28.651766	t
2	Joana Ackam	ackamjay@gmail.com	$2b$10$vhCVmdeQlR5WdNlKHjeKd.gvjVuMinLvyvoG/jseUgMJBMEtx7fJe	user	2025-04-28 18:20:13.171869	t
3	Salome	sallymutemwa@gmail.com	$2b$10$TkGErBHdJGxc/uNArkErRuR0kL35UTYBllOtIblBvk3W4NmDtKCaS	admin	2025-05-01 20:09:29.832026	t
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: joel
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 77, true);


--
-- Name: enquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: joel
--

SELECT pg_catalog.setval('public.enquiries_id_seq', 2, true);


--
-- Name: investment_analyses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: joel
--

SELECT pg_catalog.setval('public.investment_analyses_id_seq', 2, true);


--
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: joel
--

SELECT pg_catalog.setval('public.properties_id_seq', 4, true);


--
-- Name: property_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: joel
--

SELECT pg_catalog.setval('public.property_images_id_seq', 5, true);


--
-- Name: saved_properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: joel
--

SELECT pg_catalog.setval('public.saved_properties_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: joel
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: enquiries enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_pkey PRIMARY KEY (id);


--
-- Name: investment_analyses investment_analyses_pkey; Type: CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.investment_analyses
    ADD CONSTRAINT investment_analyses_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: property_images property_images_pkey; Type: CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_pkey PRIMARY KEY (id);


--
-- Name: saved_properties saved_properties_pkey; Type: CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.saved_properties
    ADD CONSTRAINT saved_properties_pkey PRIMARY KEY (id);


--
-- Name: saved_properties saved_properties_user_id_property_id_key; Type: CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.saved_properties
    ADD CONSTRAINT saved_properties_user_id_property_id_key UNIQUE (user_id, property_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_activity_logs_created_at; Type: INDEX; Schema: public; Owner: joel
--

CREATE INDEX idx_activity_logs_created_at ON public.activity_logs USING btree (created_at);


--
-- Name: idx_activity_logs_user_id; Type: INDEX; Schema: public; Owner: joel
--

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs USING btree (user_id);


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: enquiries enquiries_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: enquiries enquiries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.enquiries
    ADD CONSTRAINT enquiries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: investment_analyses investment_analyses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.investment_analyses
    ADD CONSTRAINT investment_analyses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: properties properties_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: property_images property_images_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: saved_properties saved_properties_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.saved_properties
    ADD CONSTRAINT saved_properties_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: saved_properties saved_properties_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: joel
--

ALTER TABLE ONLY public.saved_properties
    ADD CONSTRAINT saved_properties_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO joel;


--
-- PostgreSQL database dump complete
--

