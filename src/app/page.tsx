"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  PlayCircle,
  Search,
  Download,
  ArrowRight,
  Building2,
  ClipboardCheck,
  TrendingUp
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <ClipboardCheck className="w-8 h-8" />,
      title: "調査に回答",
      description: "建設業における原価の実態について、簡単なフォームで回答いただけます。",
      href: "/survey",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <PlayCircle className="w-8 h-8" />,
      title: "動画解説",
      description: "調査の目的や回答方法について、動画でわかりやすく解説しています。",
      href: "/video",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "データ検索",
      description: "過去の調査結果を検索し、業界の傾向を把握できます。",
      href: "/search",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "レポート出力",
      description: "調査データをExcel形式でダウンロードできます。",
      href: "/export",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-lg text-slate-800">国土交通省</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/survey" className="text-slate-600 hover:text-blue-600 transition-colors">
                調査回答
              </Link>
              <Link href="/video" className="text-slate-600 hover:text-blue-600 transition-colors">
                動画解説
              </Link>
              <Link href="/search" className="text-slate-600 hover:text-blue-600 transition-colors">
                データ検索
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              令和6年度 実態調査
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              適正原価に関する
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                実態調査
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10">
              建設業界における適正原価の実態を調査し、
              持続可能な建設産業の発展に寄与するための調査にご協力ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/survey"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
              >
                調査に回答する
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/video"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <PlayCircle className="w-5 h-5" />
                動画で説明を見る
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              調査システムの機能
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              本システムでは、調査への回答、動画による解説、データ検索、レポート出力などの機能をご利用いただけます。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={feature.href}>
                  <div className="group h-full bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all cursor-pointer">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-5xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">回答企業数</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-5xl font-bold mb-2">47</div>
              <div className="text-blue-100">都道府県</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="text-5xl font-bold mb-2">98%</div>
              <div className="text-blue-100">回答完了率</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              建設業界の発展に貢献
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              皆様からの回答は、建設業界における適正な原価構造の把握と、
              政策立案の基礎資料として活用されます。
              ぜひご協力をお願いいたします。
            </p>
            <Link
              href="/survey"
              className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all"
            >
              調査に参加する
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-blue-400" />
              <span className="text-white font-semibold">国土交通省</span>
            </div>
            <div className="text-sm">
              © 2024 Ministry of Land, Infrastructure, Transport and Tourism. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
